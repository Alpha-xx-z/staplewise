# StapleWise B2B Platform - Production Setup Guide

This guide provides step-by-step instructions to set up the StapleWise platform with a real database, MinIO object storage, and remove all mock data dependencies.

## 🚀 **Prerequisites**

Before starting, ensure you have:
- Node.js 18+ installed
- Docker and Docker Compose installed
- PostgreSQL database (local or cloud)
- Basic knowledge of environment variables

## 📋 **Step-by-Step Setup Process**

### **Step 1: Clone and Install Dependencies**

```bash
# Clone the repository
git clone <your-repo-url>
cd staplewise-platform

# Install dependencies
npm install

# Install additional production dependencies
npm install @prisma/client prisma minio bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

### **Step 2: Database Setup**

#### **Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE staplewise_db;
CREATE USER staplewise_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE staplewise_db TO staplewise_user;
\q
```

#### **Option B: Cloud Database (Recommended)**
Use services like:
- **Supabase**: Free tier with 500MB storage
- **Railway**: PostgreSQL with easy deployment
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Production-grade PostgreSQL

### **Step 3: MinIO Setup**

#### **Option A: Docker Compose (Recommended)**
Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  minio:
    image: minio/minio:latest
    container_name: staplewise-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio_data:
```

```bash
# Start MinIO
docker-compose up -d

# Verify MinIO is running
curl http://localhost:9000/minio/health/live
```

#### **Option B: Local Installation**
```bash
# Download MinIO server
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Create data directory
mkdir ~/minio-data

# Start MinIO server
minio server ~/minio-data --console-address ":9001"
```

### **Step 4: Environment Configuration**

Create `.env` file in project root:

```env
# Database Configuration
DATABASE_URL="postgresql://staplewise_user:your_secure_password@localhost:5432/staplewise_db"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production"

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_USE_SSL=false
MINIO_BUCKET_DOCUMENTS=staplewise-documents
MINIO_BUCKET_IMAGES=staplewise-images

# Application Configuration
NODE_ENV=development
PORT=3000

# MinIO Public URL (for file access)
MINIO_PUBLIC_URL=http://localhost:9000
```

### **Step 5: Update Prisma Configuration**

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Copy the complete schema from company-schema.prisma
// (Use the schema provided in README2.md)
```

### **Step 6: Database Migration and Setup**

```bash
# Generate Prisma client
npx prisma generate

# Create and apply initial migration
npx prisma migrate dev --name init

# Verify database connection
npx prisma db pull

# Open Prisma Studio to verify tables
npx prisma studio
```

### **Step 7: MinIO Bucket Setup**

Create `scripts/setup-minio.js`:

```javascript
const { Client } = require('minio');

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
});

async function setupBuckets() {
  const buckets = [
    'staplewise-documents',
    'staplewise-images',
    'staplewise-temp'
  ];

  for (const bucket of buckets) {
    try {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket, 'us-east-1');
        console.log(`✅ Created bucket: ${bucket}`);
        
        // Set public read policy for images
        if (bucket === 'staplewise-images') {
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
    } catch (error) {
      console.error(`❌ Error with bucket ${bucket}:`, error.message);
    }
  }
}

setupBuckets()
  .then(() => {
    console.log('🎉 MinIO setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MinIO setup failed:', error);
    process.exit(1);
  });
```

```bash
# Run MinIO setup
node scripts/setup-minio.js
```

### **Step 8: Remove Mock Data Dependencies**

#### **Update Authentication Service**
Replace `src/lib/auth.ts`:

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  companyName?: string;
  gst?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: Role;
  companyName?: string;
  gst?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  static async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: data.role,
        companyName: data.companyName,
        gst: data.gst,
      }
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName || undefined,
      gst: user.gst || undefined,
    };

    const token = this.generateToken(authUser);
    return { user: authUser, token };
  }

  static async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName || undefined,
      gst: user.gst || undefined,
    };

    const token = this.generateToken(authUser);
    return { user: authUser, token };
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName || undefined,
      gst: user.gst || undefined,
    };
  }
}
```

#### **Update API Services**
Update `src/lib/api.ts` to use real Prisma queries instead of mock data:

```typescript
import { prisma } from './prisma';
import { Product, Query, Order, QueryType, QueryStatus, OrderStatus, Role } from '@prisma/client';

export class ProductService {
  static async getAllProducts(filters?: {
    grade?: string;
    location?: string;
    priceRange?: string;
    stockAvailable?: boolean;
    search?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters?.grade) {
      where.grade = filters.grade;
    }

    if (filters?.location) {
      where.location = filters.location;
    }

    if (filters?.stockAvailable) {
      where.stock = { gt: 0 };
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { specifications: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        where.pricePerKg = { gte: min, lte: max };
      } else {
        where.pricePerKg = { gte: min };
      }
    }

    return prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Add other ProductService methods...
}

// Add other service classes...
```

### **Step 9: Create File Upload API**

Create `pages/api/upload.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'minio';
import formidable from 'formidable';
import fs from 'fs';
import { prisma } from '../../lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.status(400).json({ error: 'File too large' });
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${file.originalFilename}`;
    const bucketName = fields.type === 'document' ? 'staplewise-documents' : 'staplewise-images';

    // Upload to MinIO
    const fileBuffer = fs.readFileSync(file.filepath);
    await minioClient.putObject(bucketName, fileName, fileBuffer, file.size, {
      'Content-Type': file.mimetype || 'application/octet-stream',
    });

    // Generate public URL
    const fileUrl = `${process.env.MINIO_PUBLIC_URL}/${bucketName}/${fileName}`;

    // Save to database if it's a document
    if (fields.type === 'document' && fields.userId) {
      await prisma.document.create({
        data: {
          documentType: fields.documentType as any,
          documentName: file.originalFilename || 'Unknown',
          fileUrl,
          fileName,
          fileSize: file.size,
          mimeType: file.mimetype || 'application/octet-stream',
          userId: fields.userId as string,
        }
      });
    }

    res.status(200).json({ 
      success: true, 
      fileUrl,
      fileName 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
```

### **Step 10: Create Database Seed Script**

Create `scripts/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/lib/auth';
import { Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await AuthService.register({
    email: 'admin@staplewise.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+919876543210',
    role: Role.ADMIN,
  });
  console.log('✅ Created admin user');

  // Create sales user
  const salesUser = await AuthService.register({
    email: 'sales@staplewise.com',
    password: 'sales123',
    name: 'Sales Employee',
    phone: '+919876543211',
    role: Role.SALES,
  });
  console.log('✅ Created sales user');

  // Create sample buyer
  const buyerUser = await AuthService.register({
    email: 'buyer@example.com',
    password: 'buyer123',
    name: 'John Buyer',
    phone: '+919876543212',
    role: Role.BUYER,
    companyName: 'ABC Foods',
  });
  console.log('✅ Created buyer user');

  // Create sample seller
  const sellerUser = await AuthService.register({
    email: 'seller@example.com',
    password: 'seller123',
    name: 'Jane Seller',
    phone: '+919876543213',
    role: Role.SELLER,
    companyName: 'XYZ Cashews',
    gst: 'GST123456789',
  });
  console.log('✅ Created seller user');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### **Step 11: Update Package.json Scripts**

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "tsx scripts/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset && npm run db:seed",
    "minio:setup": "node scripts/setup-minio.js",
    "setup": "npm run db:generate && npm run db:migrate && npm run minio:setup && npm run db:seed"
  }
}
```

### **Step 12: Final Setup and Testing**

```bash
# Run complete setup
npm run setup

# Start the development server
npm run dev

# In another terminal, verify MinIO
curl http://localhost:9000/minio/health/live

# Open Prisma Studio to verify data
npm run db:studio
```

## 🔧 **Production Deployment**

### **Environment Variables for Production**

```env
# Production Database (example with Supabase)
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"

# Secure JWT Secret
JWT_SECRET="your-super-secure-production-jwt-secret-key"

# Production MinIO (or AWS S3)
MINIO_ENDPOINT=storage.yourdomain.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-production-access-key
MINIO_SECRET_KEY=your-production-secret-key

# Production URLs
MINIO_PUBLIC_URL=https://storage.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

### **Docker Production Setup**

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
    depends_on:
      - minio
      - postgres

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: staplewise_db
      POSTGRES_USER: staplewise_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  minio_data:
  postgres_data:
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Database Connection Failed:**
   ```bash
   # Check database URL
   npx prisma db pull
   
   # Verify connection
   psql $DATABASE_URL
   ```

2. **MinIO Connection Failed:**
   ```bash
   # Check MinIO status
   curl http://localhost:9000/minio/health/live
   
   # Restart MinIO
   docker-compose restart minio
   ```

3. **File Upload Issues:**
   ```bash
   # Check bucket permissions
   node scripts/setup-minio.js
   
   # Verify bucket exists
   curl http://localhost:9000/staplewise-images/
   ```

4. **Prisma Client Issues:**
   ```bash
   # Regenerate client
   npx prisma generate
   
   # Reset database
   npx prisma migrate reset
   ```

## 📋 **Verification Checklist**

- [ ] Database connected and migrated
- [ ] MinIO running with buckets created
- [ ] File upload API working
- [ ] User registration/login working
- [ ] Products can be created and listed
- [ ] Images upload to MinIO successfully
- [ ] No mock data dependencies remain
- [ ] All environment variables configured
- [ ] Prisma Studio accessible
- [ ] MinIO console accessible at :9001

## 🎉 **Success!**

Your StapleWise B2B platform is now running with:
- ✅ Real PostgreSQL database
- ✅ MinIO object storage
- ✅ File upload functionality
- ✅ User authentication
- ✅ No mock data dependencies
- ✅ Production-ready architecture

You can now:
1. Register users with different roles
2. Upload company documents and images
3. List and manage products
4. Handle queries and orders
5. Scale to production with real data

---

**Need help?** Check the troubleshooting section or review the logs for specific error messages.