import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Client } from 'minio';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Initialize MinIO client
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

// URL transformation function to convert HTTP URLs to HTTPS
function transformImageUrl(url: string): string {
  if (!url) return url;
  
  // Convert old HTTP MinIO URLs to HTTPS
  if (url.includes('http://31.97.229.127:9000')) {
    return url.replace('http://31.97.229.127:9000', 'https://srv943180.hstgr.cloud/minio-api');
  }
  
  // Convert any other HTTP URLs to HTTPS if they're from your domain
  if (url.startsWith('http://') && url.includes('31.97.229.127')) {
    return url.replace('http://', 'https://').replace('31.97.229.127', 'srv943180.hstgr.cloud');
  }
  
  return url;
}

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Email template for password reset
const createPasswordResetEmail = (userName: string, resetToken: string) => {
  const resetUrl = process.env.NODE_ENV === 'production' 
    ? `https://staplewise.vercel.app/reset-password?token=${resetToken}`
    : `http://localhost:5174/reset-password?token=${resetToken}`;
  
  return {
    subject: 'Password Reset Request - StapleWise',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">StapleWise</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Hello ${userName},</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0;">
              We received a request to reset your password for your StapleWise account. 
              If you didn't make this request, you can safely ignore this email.
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              To reset your password, click the button below:
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin: 0;">
              ${resetUrl}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This email was sent from StapleWise. If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    `
  };
};

// Initialize buckets
async function initializeBuckets() {
  const buckets = [
    process.env.MINIO_BUCKET_DOCUMENTS || 'staplewise-documents',
    process.env.MINIO_BUCKET_IMAGES || 'staplewise-images'
  ];
  
  try {
    for (const bucket of buckets) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket, 'us-east-1');
        console.log(`✅ Created bucket: ${bucket}`);
        
        // Set public read policy for images bucket
        if (bucket.includes('images')) {
          const policy = {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`]
            }]
          };
          await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
          console.log(`✅ Set public policy for: ${bucket}`);
        }
      } else {
        console.log(`✅ Bucket already exists: ${bucket}`);
      }
    }
  } catch (error) {
    console.error('❌ Error initializing MinIO buckets:', error);
  }
}

// Initialize buckets on startup
initializeBuckets();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://staplewise.vercel.app',
    'https://staplewise-git-main-staplewise.vercel.app',
    'https://staplewise-staplewise.vercel.app',
    /\.vercel\.app$/, // Allow all Vercel subdomains
    /\.vercel\.app$/  // Allow all Vercel domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER || '',
      to: 'admin@staplewise.com',
      subject: 'Test Email from StapleWise',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email configuration.</p>'
    });
    
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        companyName: user.companyName,
        gst: user.gstin
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, role, companyName, gst } = req.body;
    
    if (!email || !password || !name || !phone || !role) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        companyName,
        gstin: gst
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        companyName: user.companyName,
        gst: user.gstin
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    // Create email content
    const emailContent = createPasswordResetEmail(user.name, resetToken);

    // Send email
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER || '',
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      console.log(`Password reset email sent to ${user.email}`);
      
      res.json({
        success: true,
        message: 'Password reset instructions sent to your email'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded.userId || !decoded.email) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, email: decoded.email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Company Details routes
app.post('/api/company-details', async (req, res) => {
  try {
    const { name, city, address, registrarName, gstin, yearEstablished, phone, email } = req.body;
    
    // Get user from JWT token (in production, you'd verify the token)
    const userId = (req.headers['user-id'] as string) || 'default-user-id';
    
    if (!name || !city || !address || !registrarName || !gstin || !yearEstablished || !phone || !email) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // For now, store company details in the user table
    // In production, you'd use a separate CompanyDetails table
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user with company details
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: name,
        city: city,
        street1: address.street1,
        street2: address.street2,
        pincode: address.pincode,
        state: address.state,
        registrarName: registrarName,
        gstin: gstin,
        yearEstablished: parseInt(yearEstablished),
        phone: phone,
        email: email
      }
    });

    res.status(201).json({
      success: true,
      companyDetails: {
        id: updatedUser.id,
        name: updatedUser.companyName,
        city: updatedUser.city,
        address: {
          street1: updatedUser.street1,
          street2: updatedUser.street2,
          pincode: updatedUser.pincode,
          state: updatedUser.state
        },
        registrarName: updatedUser.registrarName,
        gstin: updatedUser.gstin,
        yearEstablished: updatedUser.yearEstablished,
        phone: updatedUser.phone,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Company details save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/company-details', async (req, res) => {
  try {
    const userId = (req.headers['user-id'] as string);
    
    if (!userId || userId === 'default-user-id') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return company info from user table
    res.json({
      success: true,
      companyDetails: {
        id: user.id,
        name: user.companyName || '',
        city: user.city || '',
        address: {
          street1: user.street1 || '',
          street2: user.street2 || '',
          pincode: user.pincode || '',
          state: user.state || ''
        },
        registrarName: user.registrarName || '',
        gstin: user.gstin || '',
        yearEstablished: user.yearEstablished || 2020,
        phone: user.phone || '',
        email: user.email || ''
      }
    });
  } catch (error) {
    console.error('Company details fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            companyName: true
          }
        }
      }
    });
    
    // Transform image URLs from HTTP to HTTPS
    const transformedProducts = products.map(product => ({
      ...product,
      primaryImage: transformImageUrl(product.primaryImage),
      additionalImages: product.additionalImages ? 
        JSON.parse(product.additionalImages).map(transformImageUrl) : []
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            companyName: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform image URLs from HTTP to HTTPS
    const transformedProduct = {
      ...product,
      primaryImage: transformImageUrl(product.primaryImage),
      additionalImages: product.additionalImages ? 
        JSON.parse(product.additionalImages).map(transformImageUrl) : []
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Queries routes
app.post('/api/queries', async (req, res) => {
  try {
    const { type, quantity, companyName, contactName, email, phone, pincode, gst, productId, message } = req.body;
    
    if (!type || !quantity || !companyName || !contactName || !email || !phone || !pincode || !productId) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const query = await prisma.query.create({
      data: {
        type,
        quantity,
        companyName,
        contactName,
        email,
        phone,
        pincode,
        gst,
        productId,
        message
      }
    });

    res.status(201).json(query);
  } catch (error) {
    console.error('Query creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders routes
app.post('/api/orders', async (req, res) => {
  try {
    const { 
      sellerId, 
      sellerName, 
      sellerEmail, 
      sellerPhone, 
      productName, 
      category, 
      grade, 
      quantity, 
      pricePerKg, 
      deliveryAddress, 
      notes,
      buyerId 
    } = req.body;

    // Validate required fields
    if (!sellerId || !productName || !quantity || !pricePerKg) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify seller exists
    const seller = await prisma.user.findUnique({
      where: { id: sellerId, role: 'SELLER' }
    });

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Verify buyer exists (if provided)
    if (buyerId) {
      const buyer = await prisma.user.findUnique({
        where: { id: buyerId }
      });
      if (!buyer) {
        return res.status(404).json({ error: 'Buyer not found' });
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Calculate total amount
    const totalAmount = quantity * pricePerKg;

    // First create the product
    const product = await prisma.product.create({
      data: {
        name: productName,
        grade,
        category,
        pricePerKg: pricePerKg,
        minimumOrderQuantity: quantity,
        sellerId,
        specifications: `${productName} - ${grade}`,
        location: seller.city || 'Location not specified',
        deliveryTime: '7-10 days',
        primaryImage: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: `${productName} - ${grade} - ${category}`,
        unit: 'KG'
      }
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount,
        totalQuantity: quantity,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddress: deliveryAddress || '',
        buyerId: buyerId || 'admin-user-id', // Default to admin if no buyer
        items: {
          create: [{
            quantity,
            pricePerKg,
            totalPrice: totalAmount,
            productId: product.id
          }]
        }
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                grade: true,
                sellerId: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('Fetching order details for:', orderId);
    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                seller: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('Order product seller:', order.items?.[0]?.product?.seller);
    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { 
      productName, 
      category, 
      grade, 
      quantity, 
      pricePerKg, 
      deliveryAddress, 
      notes,
      status 
    } = req.body;

    // Validate required fields
    if (!productName || !quantity || !pricePerKg) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total amount
    const totalAmount = quantity * pricePerKg;

    // Get the order with items to find the product ID
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the product
    if (existingOrder.items[0]?.product) {
      await prisma.product.update({
        where: { id: existingOrder.items[0].product.id },
        data: {
          name: productName,
          grade,
          category,
          pricePerKg: pricePerKg,
          minimumOrderQuantity: quantity
        }
      });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount,
        totalQuantity: quantity,
        status: status || 'PENDING',
        shippingAddress: deliveryAddress || '',
        items: {
          update: {
            where: { id: existingOrder.items[0]?.id },
            data: {
              quantity,
              pricePerKg,
              totalPrice: totalAmount
            }
          }
        }
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                grade: true,
                sellerId: true
              }
            }
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    await prisma.order.delete({
      where: { id: orderId }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Order deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Verify the seller exists
    const seller = await prisma.user.findUnique({
      where: { id: sellerId, role: 'SELLER' }
    });

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Get orders where the seller's products are ordered
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        }
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                grade: true,
                sellerId: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seller Products routes
app.get('/api/seller/products', async (req, res) => {
  try {
    // Get seller ID from token
    const sellerId = (req.headers['user-id'] as string);
    
    if (!sellerId || sellerId === 'default-seller-id') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify the user exists and is a seller
    const user = await prisma.user.findUnique({
      where: { id: sellerId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'SELLER') {
      return res.status(403).json({ error: 'Access denied. Only sellers can view their products.' });
    }
    
    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transform image URLs from HTTP to HTTPS
    const transformedProducts = products.map(product => ({
      ...product,
      primaryImage: transformImageUrl(product.primaryImage),
      additionalImages: product.additionalImages ? 
        JSON.parse(product.additionalImages).map(transformImageUrl) : []
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/seller/products', async (req, res) => {
  try {
    const {
      name,
      category,
      grade,
      pricePerKg,
      minimumOrderQuantity,
      description,
      specifications,
      specificationsAndGrade,
      qualityAssurance,
      packagingAndDelivery,
      deliveryTime,
      packagingType,
      primaryImage,
      additionalImages,
      location
    } = req.body;

    // Get seller ID from token
    const sellerId = (req.headers['user-id'] as string);
    
    if (!sellerId || sellerId === 'default-seller-id') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify the user exists and is a seller
    const user = await prisma.user.findUnique({
      where: { id: sellerId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'SELLER') {
      return res.status(403).json({ error: 'Access denied. Only sellers can create products.' });
    }

    const product = await prisma.product.create({
      data: {
        sellerId,
        name,
        category,
        grade,
        pricePerKg: parseFloat(pricePerKg),
        minimumOrderQuantity: parseInt(minimumOrderQuantity),
        description,
        specifications,
        specificationsAndGrade,
        qualityAssurance,
        packagingAndDelivery,
        deliveryTime,
        packagingType,
        primaryImage,
        additionalImages,
        location
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/seller/products/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive }
    });

    res.json(product);
  } catch (error) {
    console.error('Product status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/seller/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      grade,
      pricePerKg,
      minimumOrderQuantity,
      description,
      specifications,
      specificationsAndGrade,
      qualityAssurance,
      packagingAndDelivery,
      deliveryTime,
      packagingType,
      primaryImage,
      additionalImages,
      location
    } = req.body;

    // Get the existing product to compare images
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if images have changed and delete old ones if needed
    const bucketName = 'staplewise-images';
    const filesToDelete: string[] = [];

    // Check if primary image changed
    if (existingProduct.primaryImage && existingProduct.primaryImage !== primaryImage) {
      const oldPrimaryFileName = extractFileNameFromUrl(existingProduct.primaryImage);
      if (oldPrimaryFileName) {
        filesToDelete.push(oldPrimaryFileName);
      }
    }

    // Check if additional images changed
    if (existingProduct.additionalImages !== additionalImages) {
      if (existingProduct.additionalImages) {
        try {
          const oldAdditionalImages = JSON.parse(existingProduct.additionalImages);
          if (Array.isArray(oldAdditionalImages)) {
            oldAdditionalImages.forEach(imageUrl => {
              const fileName = extractFileNameFromUrl(imageUrl);
              if (fileName) {
                filesToDelete.push(fileName);
              }
            });
          }
        } catch (error) {
          console.error('Error parsing old additional images:', error);
        }
      }
    }

    // Delete old files from MinIO
    for (const fileName of filesToDelete) {
      try {
        await minioClient.removeObject(bucketName, fileName);
        console.log(`✅ Deleted old file from MinIO during update: ${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to delete old file from MinIO: ${fileName}`, error);
        // Continue with other files even if one fails
      }
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        grade,
        pricePerKg: parseFloat(pricePerKg),
        minimumOrderQuantity: parseInt(minimumOrderQuantity),
        description,
        specifications,
        specificationsAndGrade,
        qualityAssurance,
        packagingAndDelivery,
        deliveryTime,
        packagingType,
        primaryImage,
        additionalImages,
        location
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to extract file name from MinIO URL
function extractFileNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    // Decode URL-encoded characters
    const decodedFileName = decodeURIComponent(fileName);
    console.log(`🔍 Extracted filename: ${fileName} -> ${decodedFileName}`);
    
    return decodedFileName;
  } catch (error) {
    console.error('Error extracting file name from URL:', error);
    return null;
  }
}

app.delete('/api/seller/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the product to extract image URLs
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log(`🗑️ Starting deletion for product: ${product.name}`);
    console.log(`📸 Primary image: ${product.primaryImage}`);
    console.log(`📸 Additional images: ${product.additionalImages}`);

    // Delete images from MinIO
    const bucketName = 'staplewise-images';
    const filesToDelete: string[] = [];

    // Add primary image
    if (product.primaryImage) {
      const primaryFileName = extractFileNameFromUrl(product.primaryImage);
      if (primaryFileName) {
        filesToDelete.push(primaryFileName);
        console.log(`📋 Added primary image to delete: ${primaryFileName}`);
      } else {
        console.log(`⚠️ Could not extract filename from primary image URL: ${product.primaryImage}`);
      }
    }

    // Add additional images
    if (product.additionalImages) {
      try {
        const additionalImages = JSON.parse(product.additionalImages);
        if (Array.isArray(additionalImages)) {
          additionalImages.forEach(imageUrl => {
            const fileName = extractFileNameFromUrl(imageUrl);
            if (fileName) {
              filesToDelete.push(fileName);
              console.log(`📋 Added additional image to delete: ${fileName}`);
            } else {
              console.log(`⚠️ Could not extract filename from additional image URL: ${imageUrl}`);
            }
          });
        }
      } catch (error) {
        console.error('Error parsing additional images:', error);
      }
    }

    console.log(`🗂️ Total files to delete: ${filesToDelete.length}`);
    console.log(`📝 Files to delete:`, filesToDelete);

    // Delete files from MinIO
    for (const fileName of filesToDelete) {
      try {
        await minioClient.removeObject(bucketName, fileName);
        console.log(`✅ Deleted file from MinIO: ${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to delete file from MinIO: ${fileName}`, error);
        // Continue with other files even if one fails
      }
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id }
    });

    console.log(`✅ Product deleted from database: ${id}`);

    res.json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload route
const upload = multer({ storage: multer.memoryStorage() });

// Debug endpoint to list all files in MinIO bucket
app.get('/api/debug/minio-files', async (req, res) => {
  try {
    const bucketName = 'staplewise-images';
    const stream = minioClient.listObjects(bucketName, '', true);
    const files: any[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => files.push(obj));
      stream.on('end', () => {
        console.log(`📦 Found ${files.length} files in MinIO bucket:`, files.map(f => f.name));
        res.json({ 
          bucketName, 
          fileCount: files.length, 
          files: files.map(f => ({ name: f.name, size: f.size, lastModified: f.lastModified }))
        });
      });
      stream.on('error', reject);
    });
  } catch (error) {
    console.error('Error listing MinIO files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = req.body.bucket || 'staplewise-images';
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to MinIO
    await minioClient.putObject(
      bucket,
      fileName,
      req.file.buffer,
      req.file.size,
      { 'Content-Type': req.file.mimetype }
    );

    // Generate public URL
            const fileUrl = `${process.env.MINIO_PUBLIC_URL || 'https://srv943180.hstgr.cloud/minio-api'}/${bucket}/${fileName}`;
    
    res.json({ fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Admin User Management routes
app.delete('/api/admin/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query Assignment routes
app.post('/api/admin/queries/:queryId/assign', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { assignedToId, status } = req.body;
    
    // Check if query exists
    const query = await prisma.query.findUnique({
      where: { id: queryId }
    });

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    // Check if assigned user exists and is a sales employee
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId }
      });

      if (!assignedUser || assignedUser.role !== 'SALES') {
        return res.status(400).json({ error: 'Invalid sales employee' });
      }
    }

    // Update query
    const updatedQuery = await prisma.query.update({
      where: { id: queryId },
      data: {
        assignedToId: assignedToId || null,
        status: status || 'ASSIGNED',
        assignedAt: assignedToId ? new Date() : null
      },
      include: {
        user: true,
        product: true
      }
    });

    res.json({ success: true, query: updatedQuery });
  } catch (error) {
    console.error('Assign query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/queries/:queryId/status', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status } = req.body;
    
    // Check if query exists
    const query = await prisma.query.findUnique({
      where: { id: queryId }
    });

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    // Update query status
    const updatedQuery = await prisma.query.update({
      where: { id: queryId },
      data: { status },
      include: {
        user: true,
        product: true
      }
    });

    res.json({ success: true, query: updatedQuery });
  } catch (error) {
    console.error('Update query status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public Query Creation endpoint
app.post('/api/queries', async (req, res) => {
  try {
    const { type, quantity, contactName, companyName, pincode, email, phone, gst, productId, userId } = req.body;
    
    // Validate required fields
    if (!type || !quantity || !contactName || !companyName || !pincode || !email || !phone || !productId) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Create query
    const query = await prisma.query.create({
      data: {
        type,
        quantity: parseInt(quantity),
        companyName,
        contactName,
        pincode,
        email,
        phone,
        gst,
        productId,
        userId: userId || null,
        status: 'PENDING',
        priority: 'MEDIUM'
      },
      include: {
        product: true,
        user: true
      }
    });

    res.status(201).json({ success: true, query });
  } catch (error) {
    console.error('Create query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete query endpoint
app.delete('/api/admin/queries/:queryId', async (req, res) => {
  try {
    const { queryId } = req.params;
    
    // Check if query exists
    const query = await prisma.query.findUnique({
      where: { id: queryId }
    });

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    // Delete query
    await prisma.query.delete({
      where: { id: queryId }
    });

    res.json({ success: true, message: 'Query deleted successfully' });
  } catch (error) {
    console.error('Delete query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Dashboard routes
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    const [totalVisitors, totalProducts, totalQueries, totalUsers] = await Promise.all([
      prisma.user.count({ where: { role: 'BUYER' } }),
      prisma.product.count(),
      prisma.query.count(),
      prisma.user.count()
    ]);

    const recentQueries = await prisma.query.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
        user: { select: { name: true, companyName: true } }
      }
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        },
        buyer: { select: { name: true, companyName: true } }
      }
    });

    const userDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    const queryStatusDistribution = await prisma.query.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const orderStatusDistribution = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    res.json({
      stats: {
        totalVisitors,
        totalProducts,
        totalQueries,
        totalUsers
      },
      recentActivity: {
        queries: recentQueries,
        orders: recentOrders
      },
      distributions: {
        users: userDistribution,
        queries: queryStatusDistribution,
        orders: orderStatusDistribution
      }
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/admin/queries', async (req, res) => {
  try {
    const { status, type, assignedToId } = req.query;
    
    const where: any = {};
    
    if (status && typeof status === 'string') {
      where.status = status;
    }
    
    if (type && typeof type === 'string') {
      where.type = type;
    }
    
    if (assignedToId && typeof assignedToId === 'string') {
      where.assignedToId = assignedToId;
    }

    const queries = await prisma.query.findMany({
      where,
      include: {
        product: {
          select: {
            name: true,
            grade: true
          }
        },
        user: {
          select: {
            name: true,
            companyName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(queries);
  } catch (error) {
    console.error('Admin queries fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyName: true,
        gstin: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        buyer: {
          select: {
            name: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                grade: true,
                seller: {
                  select: {
                    name: true,
                    companyName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/orders', async (req, res) => {
  try {
    const { 
      sellerId, 
      sellerName, 
      sellerEmail, 
      sellerPhone, 
      productName, 
      category, 
      grade, 
      quantity, 
      pricePerKg, 
      deliveryAddress, 
      notes,
      buyerId 
    } = req.body;

    // Validate required fields
    if (!sellerId || !productName || !quantity || !pricePerKg) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify seller exists
    const seller = await prisma.user.findUnique({
      where: { id: sellerId, role: 'SELLER' }
    });

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Verify buyer exists (if provided)
    if (buyerId) {
      const buyer = await prisma.user.findUnique({
        where: { id: buyerId }
      });
      if (!buyer) {
        return res.status(404).json({ error: 'Buyer not found' });
      }
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    // Calculate total amount
    const totalAmount = quantity * pricePerKg;

    // First create the product
    const product = await prisma.product.create({
      data: {
        name: productName,
        grade,
        category,
        pricePerKg: pricePerKg,
        minimumOrderQuantity: quantity,
        sellerId,
        specifications: `${productName} - ${grade}`,
        location: seller.city || 'Location not specified',
        deliveryTime: '7-10 days',
        primaryImage: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount,
        totalQuantity: quantity,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddress: deliveryAddress || '',
        buyerId: buyerId || 'admin-user-id', // Default to admin if no buyer
        items: {
          create: [{
            quantity,
            pricePerKg,
            totalPrice: totalAmount,
            productId: product.id
          }]
        }
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                grade: true,
                sellerId: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Admin order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/sellers', async (req, res) => {
  try {
    const sellers = await prisma.user.findMany({
      where: { 
        role: 'SELLER',
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        city: true,
        state: true
      },
      orderBy: {
        companyName: 'asc'
      }
    });

    res.json(sellers);
  } catch (error) {
    console.error('Admin sellers fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 