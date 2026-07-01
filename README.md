# 🔐 AuthMail

A production-inspired authentication API built with **TypeScript**, **Express**, and **MongoDB**. AuthMail provides secure user authentication using JWTs, refresh tokens, email verification, password reset, and robust request validation.

## ✨ Features

- User Registration
- User Login
- JWT Authentication
- Access & Refresh Token Strateg
- Secure HTTP-only Cookies
- Email Verification
- Forgot Password
- Reset Password
- Password Hashing with bcrypt
- Refresh Token Rotation
- Request Validation using Zod
- Centralized Error Handling
- Type-safe API with TypeScript

---

## 🛠️ Tech Stack

- **TypeScript**
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Zod**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **Nodemailer**
- **Mailtrap** (for email testing)
- **Cookie Parser**
- **dotenv**

---
## 🔐 Authentication Flow

### Register

- Validate request using Zod
- Check if user already exists
- Hash password
- Create user
- Generate email verification token
- Send verification email

### Login

- Validate credentials
- Compare password
- Generate Access Token
- Generate Refresh Token
- Store Refresh Token in database
- Send tokens via HTTP-only cookies

### Email Verification

- Verify email token
- Mark account as verified

### Forgot Password

- Generate secure random token
- Hash token before storing
- Send reset link via email

### Reset Password

- Validate token
- Update password
- Clear reset token
- Invalidate old refresh tokens

### Refresh Token

- Validate refresh token
- Rotate refresh token
- Issue new access token

---
## 📦 Installation

git clone https://github.com/KhushOS-hub/authmail.git

cd authmail

npm install

---
## 🚀 Running the Project
npm run dev

---
## 🔒 Security Practices

- Passwords hashed using bcrypt
- HTTP-only cookies
- Refresh token rotation
- Email verification before account activation
- Secure password reset tokens (hashed in database)
- Input validation using Zod
- Centralized error handling
- Environment variables for secrets

---
## 📚 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/logout` | Logout |
|POST| `/api/v1/auth/send-verification-emial` | Send a verificaton email |
| GET | `/api/v1/auth/verify-email/:token` | Verify email |
| POST | `/api/v1/auth/forgot-password` | Send password reset email |
| POST | `/api/v1/auth/reset-password/:token` | Reset password |

---
