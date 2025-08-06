# 🥜 StapleWise - B2B Cashew Procurement Platform

A modern, technology-driven platform for transparent and efficient B2B cashew trading in India.

## 📚 **Documentation**

All documentation has been organized in the `documents/` folder for better organization. See [INDEX.md](./INDEX.md) for a complete guide to all available documentation.

### **Quick Links:**
- [🚀 Production Deployment Guide](./123.md)
- [🔒 Security Checklist](./SECURITY.md)
- [📧 Email Setup Guide](./EMAIL_SETUP.md)
- [📦 MinIO Setup Guide](./MINIO_SETUP.md)

## 🚀 Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd staplewise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   npm run dev:full
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: MinIO (S3-compatible)
- **Authentication**: JWT-based

## 📁 Project Structure

```
staplewise/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── lib/           # Utility libraries
│   └── types/         # TypeScript types
├── prisma/            # Database schema and migrations
├── server.ts          # Express server
└── package.json       # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data

## 🚀 Deployment

### Option 1: VPS Deployment (Recommended)

For full control and better performance, deploy to a VPS:

1. **Follow the complete deployment guide**: [123.md](./123.md) (Docker-based)
2. **Use the deployment script**: `./deploy-docker.sh`

### Option 2: Vercel Deployment

For quick deployment with managed infrastructure:

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel --prod`

### Environment Variables

Copy `env.production.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# JWT
JWT_SECRET="your-secret-key"

# MinIO
MINIO_ENDPOINT="your-minio-endpoint"
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"

# Server
PORT=3000
NODE_ENV=production
```

## 👥 User Roles

- **Admin**: Full platform management
- **Sales**: Query management and customer support
- **Seller**: Product listing and order management
- **Buyer**: Product browsing and query submission

## 🔐 Authentication

- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt

## 📊 Features

### Admin Dashboard
- Dashboard overview with real-time statistics
- User management (create, edit, delete)
- Order management with status updates
- Product query management
- Sales employee management
- Excel export functionality

### Seller Portal
- Product listing with detailed specifications
- Order management
- Company profile management
- Image upload support

### Buyer Features
- Product browsing with filters
- Query submission
- Contact forms

## 🛠️ Development

### Database Schema

The application uses Prisma with the following main models:
- `User` - Authentication and user management
- `Product` - Product listings
- `Order` - Order management
- `Query` - Product queries

### API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get all products
- `POST /api/seller/products` - Create product listing
- `GET /api/admin/dashboard-stats` - Admin dashboard data

## 🔧 Configuration Files

- `ecosystem.config.js` - PM2 configuration for production
- `vercel.json` - Vercel deployment configuration
- `env.production.example` - Production environment template

## 📝 License

This project is proprietary software.

## 🤝 Support

For deployment and technical support, refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.