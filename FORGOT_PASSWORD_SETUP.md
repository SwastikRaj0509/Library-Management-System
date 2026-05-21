# Forgot Password Feature Implementation

## Overview
This document outlines the forgot password feature implementation for the AI Library Management System.

## Features Implemented

### 1. Backend Changes

#### Database Model (server/models/user.js)
- Added `resetPasswordToken` field to store the reset token
- Added `resetPasswordExpires` field to store token expiration time

#### New Endpoints (server/routes/authRoutes.js)
- **POST /api/auth/forgot-password** - Send password reset link to user's email
- **POST /api/auth/reset-password** - Reset password using the token
- **GET /api/auth/verify-token/:token** - Verify if the reset token is valid

#### Authentication Controller (server/controllers/authController.js)
- `forgotPassword()` - Generates a reset token and sends email
- `resetPassword()` - Validates token and updates password
- `verifyResetToken()` - Validates the reset token

#### Email Service (server/utils/sendEmail.js)
- Uses nodemailer to send password reset emails
- Professional HTML email template with reset link
- Token expiration: 1 hour

### 2. Frontend Changes

#### New Pages
1. **ForgotPassword.jsx** (`client/src/pages/ForgotPassword.jsx`)
   - Form to enter email address
   - Sends password reset request
   - Success/error message display
   - Redirect to login after submission

2. **ResetPassword.jsx** (`client/src/pages/ResetPassword.jsx`)
   - Token validation on mount
   - Form to enter new password
   - Password confirmation field
   - Show/hide password toggles
   - Secure password reset process

#### Updated Files
- **Login.jsx** - Added "Forgot Password?" link under password field
- **App.jsx** - Added routes for both new pages

### 3. Dependencies

#### Added to server/package.json
```json
"nodemailer": "^6.9.7"
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/library

# JWT Secret
JWT_SECRET=your_secret_key_here

# Port
PORT=5000

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Client URL
CLIENT_URL=http://localhost:5173

# Groq API Key (if using AI features)
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Gmail Setup (for email sending)

To use Gmail for sending emails:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Navigate to Security settings
3. Enable "2-Step Verification"
4. Generate an "App Password" for your application
5. Use the generated password as `EMAIL_PASSWORD` in .env

**Note:** If 2-Step Verification is not enabled, you can use your regular Gmail password, but this is less secure.

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Run the Application

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## User Flow

### Forgot Password Process:
1. User clicks "Forgot Password?" link on login page
2. User enters their email address
3. System generates a unique reset token (valid for 1 hour)
4. Email with reset link is sent to user
5. User clicks the link in the email
6. System verifies the token
7. User enters new password and confirms it
8. Password is updated in the database
9. User can log in with new password

## Email Template

The password reset email includes:
- Professional formatting with brand colors
- Direct reset button link
- Plain text fallback link
- 1-hour expiration notice
- Security reminder

## Security Features

✅ **Token Expiration** - Reset tokens expire after 1 hour  
✅ **One-time Use** - Token is cleared after password reset  
✅ **Secure Hashing** - Passwords are hashed with bcrypt  
✅ **Email Validation** - User must have registered email  
✅ **HTTPS Recommended** - Use HTTPS in production  
✅ **Password Strength** - Minimum 6 characters required  

## API Response Examples

### Forgot Password Request
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

# Success Response (200)
{
  "message": "Password reset link sent to your email"
}

# Error Response (404)
{
  "message": "User not found with this email"
}
```

### Reset Password Request
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "newPassword123"
}

# Success Response (200)
{
  "message": "Password reset successfully"
}

# Error Response (400)
{
  "message": "Invalid or expired reset token"
}
```

### Verify Token Request
```bash
GET /api/auth/verify-token/reset_token_here

# Success Response (200)
{
  "message": "Token is valid",
  "valid": true
}

# Error Response (400)
{
  "message": "Invalid or expired reset token"
}
```

## Troubleshooting

### Email Not Sending?
- Check if `EMAIL_USER` and `EMAIL_PASSWORD` are correct in .env
- Ensure Gmail 2-Step Verification is enabled
- Verify `CLIENT_URL` is correct
- Check server logs for error messages

### Token Expires Too Quickly?
- Default expiration is 1 hour - modify in `authController.js` line with `60 * 60 * 1000`
- 60 * 60 * 1000 = 1 hour in milliseconds
- Change to desired milliseconds (e.g., 30 * 60 * 1000 = 30 minutes)

### Reset Link Not Working?
- Ensure token is passed correctly in URL
- Check if token is expired
- Verify `CLIENT_URL` in .env matches your frontend URL
- Check browser console for errors

## File Structure

```
server/
├── controllers/
│   └── authController.js (updated)
├── models/
│   └── user.js (updated)
├── routes/
│   └── authRoutes.js (updated)
├── utils/
│   └── sendEmail.js (new)
└── .env.example (new)

client/src/
├── pages/
│   ├── Login.jsx (updated)
│   ├── ForgotPassword.jsx (new)
│   └── ResetPassword.jsx (new)
└── App.jsx (updated)
```

## Testing

### Test Forgot Password:
1. Go to login page
2. Click "Forgot Password?"
3. Enter registered email
4. Check email for reset link
5. Click reset link
6. Enter new password
7. Success message should appear
8. Log in with new password

---

**Implementation Date:** May 12, 2026  
**Framework:** MERN Stack (MongoDB, Express, React, Node.js)  
**Status:** ✅ Complete and Ready for Use
