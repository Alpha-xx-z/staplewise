# StapleWise B2B Cashew Procurement Platform

A comprehensive B2B marketplace for cashew procurement built with React, TypeScript, Prisma ORM, and SQLite/PostgreSQL.

## 🚀 What's Installed

### Core Dependencies
- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework

### Database & ORM
- **Prisma** - Modern database toolkit and ORM
- **@prisma/client** - Prisma database client
- **SQLite** - Default database (can switch to PostgreSQL/MySQL)

### Authentication & Security
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **@types/bcryptjs** - TypeScript types for bcryptjs
- **@types/jsonwebtoken** - TypeScript types for jsonwebtoken

### Browser Polyfills (for Node.js compatibility)
- **buffer** - Buffer polyfill for browser
- **stream-browserify** - Stream polyfill for browser
- **util** - Util polyfill for browser

### UI & Icons
- **lucide-react** - Modern icon library
- **@fontsource/playfair-display** - Playfair Display font
- **@fontsource/poppins** - Poppins font

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── LoginModal.tsx
│       ├── FloatingPopup.tsx
│       └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── mockData.ts
├── lib/
│   ├── prisma.ts      # Prisma client setup
│   ├── auth.ts        # Authentication service
│   └── api.ts         # Database services
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── dashboards/
│   │   ├── AdminDashboard.tsx
│   │   └── SalesDashboard.tsx
│   └── seller/
│       ├── SellerPortal.tsx
│       ├── SellerLogin.tsx
│       ├── CompanyDetails.tsx
│       ├── ListProduct.tsx
│       └── Orders.tsx
├── types/
│   └── index.ts
└── main.tsx

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations (auto-generated)
```

## 🗄️ Database Setup & Operations

### Environment Configuration

The database configuration is in the `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### Database URL Configuration

**For SQLite (Default):**
```env
DATABASE_URL="file:./dev.db"
```

**For PostgreSQL:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/staplewise_db"
```

**For MySQL:**
```env
DATABASE_URL="mysql://username:password@localhost:3306/staplewise_db"
```

### Available Database Commands

```bash
# Generate Prisma client (run after schema changes)
npm run db:generate

# Push schema to database (creates/updates tables)
npm run db:push

# Seed database with demo data
npm run db:seed

# Open Prisma Studio (visual database browser)
npm run db:studio

# Reset database and reseed with fresh data
npm run db:reset
```

### Database Schema Overview

The platform includes these main entities:

1. **Users** - Admin, Sales, Buyer, Seller roles
2. **Products** - Cashew products with grades and pricing
3. **Queries** - Buy/sell requests from users
4. **Orders** - Completed transactions
5. **CompanyDetails** - Seller company information

## 🔐 Authentication System

### Demo User Credentials

```
Admin:  admin@staplewise.com  / password123
Sales:  sales@staplewise.com  / password123
Buyer:  buyer@example.com     / password123
Seller: seller@example.com    / password123
```

### User Roles & Access

- **Admin**: Full platform access, user management
- **Sales**: Query management, customer support
- **Buyer**: Browse products, place orders
- **Seller**: Manage products, view orders

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Seed with demo data
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Database Studio**: `npm run db:studio` (opens at http://localhost:5555)

## 🔧 Database Operations Guide

### Viewing Data
```bash
# Open Prisma Studio for visual database management
npm run db:studio
```

### Making Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Run `npm run db:generate` to update Prisma client

### Resetting Database
```bash
# Complete reset with fresh demo data
npm run db:reset
```

### Adding New Data
```bash
# Run seed script to add demo data
npm run db:seed
```

## 📊 Database Services

### ProductService
- `getAllProducts()` - Get all products with filters
- `getProductById()` - Get single product
- `createProduct()` - Add new product
- `updateProduct()` - Update existing product
- `deleteProduct()` - Remove product

### QueryService
- `createQuery()` - Create buy/sell query
- `getAllQueries()` - Get queries with filters
- `updateQueryStatus()` - Update query status

### OrderService
- `createOrder()` - Create new order
- `getOrdersByBuyer()` - Get buyer's orders
- `getOrdersBySeller()` - Get seller's orders

### AuthService
- `register()` - User registration
- `login()` - User authentication
- `hashPassword()` - Password hashing
- `verifyToken()` - JWT verification

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Protected routes by user role
- **Input Validation**: Form validation and sanitization

## 🎨 UI Components

### Common Components
- **Header**: Navigation with auth state
- **Footer**: Site information and links
- **LoginModal**: Authentication modal
- **FloatingPopup**: Buy/sell inquiry forms
- **ProtectedRoute**: Role-based route protection

### Page Components
- **Home**: Landing page with features
- **Products**: Product catalog with filters
- **ProductDetail**: Individual product pages
- **Dashboards**: Role-specific admin panels
- **Seller Portal**: Seller management interface

## 📱 Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Tailwind CSS**: Utility-first styling
- **Custom Fonts**: Playfair Display + Poppins
- **Modern UI**: Soft shadows, gradients, animations

## 🔄 Development Workflow

### Making Changes
1. Edit source files in `src/`
2. Database changes in `prisma/schema.prisma`
3. Run `npm run db:push` for schema updates
4. Test changes with `npm run dev`

### Adding New Features
1. Create components in appropriate directories
2. Add routes in `App.tsx`
3. Update database schema if needed
4. Add proper TypeScript types

## 🚀 Production Deployment

### Environment Variables
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-secure-production-jwt-secret"
NODE_ENV="production"
```

### Build Commands
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Troubleshooting

### Common Issues

**Prisma Client Not Generated:**
```bash
npm run db:generate
```

**Database Connection Issues:**
- Check `DATABASE_URL` in `.env`
- Ensure database server is running (for PostgreSQL/MySQL)

**Authentication Errors:**
- Verify `JWT_SECRET` is set in `.env`
- Check user credentials against seeded data

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📞 Support

For issues or questions:
- Check the console for error messages
- Verify environment variables are set
- Ensure database is properly seeded
- Review the authentication flow

---

**Built with ❤️ using React, TypeScript, Prisma, and modern web technologies.**