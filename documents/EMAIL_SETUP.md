# 📧 Email Setup Guide for Password Reset

## Current Issue
The Gmail authentication is failing with error: `535-5.7.8 Username and Password not accepted`

## 🔧 Solution Steps

### Step 1: Fix Gmail Settings
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Enable **2-Step Verification** if not already enabled
4. Go to **App passwords** (under 2-Step Verification)
5. Select **Mail** and **Other (Custom name)**
6. Enter name: `StapleWise Password Reset`
7. Click **Generate**
8. Copy the 16-character password (without spaces)

### Step 2: Update Environment Variables
Create or update your `.env` file with:

```env
# Email Configuration
EMAIL_USER=staplewise.business@gmail.com
EMAIL_PASS=your_new_app_password_here

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database
DATABASE_URL="file:./dev.db"

# MinIO Configuration
MINIO_ENDPOINT=31.97.229.127
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_DOCUMENTS=staplewise-documents
MINIO_BUCKET_IMAGES=staplewise-images
```

### Step 3: Test Email Configuration
After updating the credentials, restart the server and test:

```bash
curl http://localhost:3000/api/test-email
```

## 🚀 How It Works

1. **User clicks "Forgot Password?"** in login form
2. **Enters email address** and submits
3. **Server validates email** exists in database
4. **Generates secure reset token** (JWT, 1 hour expiry)
5. **Sends professional email** with reset link
6. **User clicks link** in email
7. **Enters new password** on reset page
8. **Server updates password** and redirects to login

## 📧 Email Template Features

- ✅ **Professional Design** - StapleWise branded
- ✅ **Secure Reset Link** - 1-hour expiration
- ✅ **Clear Instructions** - Easy to follow
- ✅ **Fallback Link** - Copy-paste option
- ✅ **Security Notice** - Explains token expiry

## 🔒 Security Features

- ✅ **JWT Tokens** - Secure, signed tokens
- ✅ **1-Hour Expiry** - Automatic token expiration
- ✅ **Email Validation** - Only sends to registered users
- ✅ **Password Hashing** - New passwords are hashed
- ✅ **Token Verification** - Validates token authenticity

## 🛠️ Troubleshooting

### If emails still don't send:
1. Check Gmail app password is correct
2. Ensure 2-factor authentication is enabled
3. Try generating a new app password
4. Check server logs for specific error messages

### Alternative Email Services:
If Gmail continues to have issues, consider:
- **SendGrid** (100 emails/day free)
- **Mailgun** (5,000 emails/month free)
- **AWS SES** (62,000 emails/month free)

## 📱 Frontend Integration

The frontend now includes:
- ✅ **Forgot Password Form** - Email input
- ✅ **Reset Password Page** - New password form
- ✅ **Email Link Handling** - Automatic token extraction
- ✅ **Success/Error Messages** - User feedback
- ✅ **Auto-redirect** - Back to login after reset 