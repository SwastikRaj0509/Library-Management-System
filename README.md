# AI Library Management System 📚🤖

A modern, full-stack **MERN** (MongoDB, Express, React, Node.js) Library Management System featuring user role-based access, book borrow/return workflows, real-time analytics, and an **AI Librarian Assistant** powered by Groq.

---

## 🌟 Features

### 🔐 Authentication & Roles
- **Secure Authentication**: Password hashing via `bcryptjs` and session tokens via `JSON Web Token (JWT)`.
- **Forgot Password Flow**: Secure password reset tokens sent via email using `Nodemailer` with a 1-hour expiration.
- **Role-Based Access Control**:
  - `Admin`: Full management of books, users, and global borrow operations.
  - `Librarian`: Manage books, borrow status, and oversee transactions.
  - `User`: Browse catalog, request/borrow books, track personal history, and view active/overdue items.

### 📖 Book Management
- Full CRUD operations (Add, View, Edit, Delete).
- Rich details including Title, Author, Category, Publisher, ISBN, Quantity, Available Copies, Description, and Cover Images.

### 🔄 Borrowing & Returning
- Request and borrow system.
- Due date setting, automatic return dates, and overdue status checks.
- Fine calculation and tracking for late returns.

### 📊 Dashboard & Analytics
- Live visual analytics constructed with `Recharts`.
- Key performance metrics: Total Books, Active Borrows, Overdue Books, and Total Fines.

### 🤖 AI Librarian Chat
- Interactive virtual librarian powered by the **Groq SDK** using the `llama-3.3-70b-versatile` model.
- Get book suggestions, advice, and system information in a dark-themed chat interface.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS (v4), Framer Motion, Lucide Icons, Recharts, Axios, React Router Dom v7, React Hot Toast |
| **Backend** | Node.js, Express 5, Mongoose 9, JWT, bcryptjs, Nodemailer, Groq SDK |
| **Database** | MongoDB Atlas (NoSQL) |

---

## 📁 Project Structure

```
.
├── client/                 # React Frontend (Vite + Tailwind CSS v4)
│   ├── public/             # Static assets
│   └── src/
│       ├── assets/         # App images and logos
│       ├── components/     # Reusable layout and UI elements
│       ├── context/        # Global authentication context
│       ├── pages/          # Pages (Login, Register, Dashboard, Books, MyBooks, AIChat, ResetPassword, etc.)
│       ├── routes/         # Protected routes configurations
│       └── services/       # Axios API client setup
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB Connection settings
│   ├── controllers/        # Express route handler logic
│   ├── middlewares/        # Authentication and error handler middlewares
│   ├── models/             # Mongoose schemas (Book, Borrow, User)
│   ├── routes/             # REST API routers
│   ├── utils/              # Helper utilities (Email sender, etc.)
│   └── .env.example        # Environment template variables
└── FORGOT_PASSWORD_SETUP.md # Detailed instructions for password reset setup
```

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB database instance
- [Groq API Key](https://console.groq.com/) for AI Features
- [Gmail App Password](https://myaccount.google.com/) (if enabling email notifications/resets)

### Step 1: Configure Environment Variables
Navigate to the `server/` directory, create a `.env` file based on `.env.example`, and fill in your credentials:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file:
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

# Groq API Key (for AI Librarian Chat)
GROQ_API_KEY=your_groq_api_key_here
```

### Step 2: Install & Start Backend
From the `server/` folder:
```bash
# Install dependencies
npm install

# Start the server in development mode (using nodemon)
npm run dev
```
The backend server runs at `http://localhost:5000`.

### Step 3: Install & Start Frontend
Open a new terminal window, navigate to the `client/` folder:
```bash
cd ../client

# Install dependencies
npm install

# Start development client (using Vite)
npm run dev
```
The client website runs at `http://localhost:5173`.

---

## 🗃️ Database Schema Models

### 👤 User Model (`user.js`)
- `name`: string (Required)
- `email`: string (Required, Unique)
- `password`: string (Required, Hashed)
- `role`: string (Enum: `admin`, `librarian`, `user`, default: `user`)
- `resetPasswordToken`: string (default: null)
- `resetPasswordExpires`: Date (default: null)

### 📚 Book Model (`Book.js`)
- `title`: string (Required)
- `author`: string (Required)
- `category`: string (Required)
- `isbn`: string (Required, Unique)
- `publisher`: string
- `quantity`: number (default: 1)
- `availableCopies`: number (default: 1)
- `description`: string
- `image`: string (URL/Base64)

### 🔄 Borrow Model (`Borrow.js`)
- `user`: ObjectId (Ref: `User`, Required)
- `book`: ObjectId (Ref: `Book`, Required)
- `borrowDate`: Date (default: Date.now)
- `dueDate`: Date (Required)
- `returnDate`: Date
- `fine`: number (default: 0)
- `isOverdue`: boolean (default: false)
- `status`: string (Enum: `borrowed`, `returned`, default: `borrowed`)

---

## 📡 API Reference

### 🔐 Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and return JWT token
- `POST /api/auth/forgot-password` - Request a password reset email
- `POST /api/auth/reset-password` - Update password using token
- `GET /api/auth/verify-token/:token` - Check reset token validity

### 📚 Books
- `GET /api/books` - Retrieve all books
- `GET /api/books/:id` - Fetch single book details
- `POST /api/books` - Add a new book (Admin/Librarian)
- `PUT /api/books/:id` - Update book details (Admin/Librarian)
- `DELETE /api/books/:id` - Remove a book (Admin/Librarian)

### 🔄 Borrow Transactions
- `POST /api/borrow/request` - Borrow/request a book
- `PUT /api/borrow/return/:id` - Return a borrowed book and calculate fines
- `GET /api/borrow/mybooks` - Retrieve borrowing history for currently logged-in user
- `GET /api/borrow/all` - List all borrowing transactions (Admin/Librarian)

### 📊 Dashboard Statistics
- `GET /api/dashboard/stats` - Fetch overall library statistics (Book count, overdue items, active borrows, fines)

### 🤖 AI Librarian
- `POST /api/ai/chat` - Post message to Llama-3 AI Assistant and get a book/recommendation reply

---

## 🛠️ Troubleshooting

- **Email is not sending**: Follow the Google App Passwords setup steps in `FORGOT_PASSWORD_SETUP.md`. You must enable 2-Step Verification first.
- **Port Conflict**: If port 5000 is occupied (common on macOS/Windows Airplay), change the `PORT` inside the `server/.env` file.
- **MongoDB Connection Error**: Check your internet connection and verify you whitelisted your IP address in MongoDB Atlas Network Security settings.
- **AI Chat doesn't respond**: Verify that `GROQ_API_KEY` is set correctly in `server/.env`.
