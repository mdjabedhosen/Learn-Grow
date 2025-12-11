# 🚀 Complete Backend Development & Integration Guide

Congratulations on completing the frontend! This guide will walk you through building a robust, production-ready backend for **Learn & Grow**, connecting it to a database, and integrating it with your Next.js frontend.

## 🛠️ Phase 1: Technology Stack & Setup

For a modern, scalable, and easy-to-integrate backend, we will use the **MERN Stack** ecosystem (excluding React since we have Next.js):
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (using Mongoose ODM)
*   **Language:** TypeScript (for consistency with your frontend)
*   **Authentication:** JWT (JSON Web Tokens)

### 1.1 Initialize the Backend Project
Create a new folder named `backend` (outside your `Learn-Grow` frontend folder, or inside the root `future-dev-v2-main`).

```bash
mkdir backend
cd backend
npm init -y
```

### 1.2 Install Dependencies
Install the core libraries and development tools.

```bash
# Core Dependencies
npm install express mongoose dotenv cors helmet morgan jsonwebtoken bcryptjs zod

# TypeScript & Dev Tools
npm install -D typescript ts-node nodemon @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/bcryptjs
```

### 1.3 TypeScript Configuration
Create a `tsconfig.json` file in the `backend` folder:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### 1.4 Project Structure
Create the following folder structure inside `backend/src`:

```
src/
├── config/         # Database connection & env setup
├── controllers/    # Request logic (getUsers, login, etc.)
├── models/         # Mongoose Schemas (User, Course, Class)
├── routes/         # API endpoints
├── middlewares/    # Auth checks, Error handling
├── utils/          # Helper functions (Hash password, generate token)
└── app.ts          # App entry point
```

---

## 🗄️ Phase 2: Database Connection & Models

### 2.1 Connect to MongoDB (`src/config/db.ts`)

```typescript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
```

### 2.2 Create User Model (`src/models/User.ts`)
This model supports your Admin, Instructor, Student, and Guardian roles.

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  password?: string;
  role: 'admin' | 'instructor' | 'student' | 'guardian';
  studentId?: string; // specific to student
  children?: string[]; // specific to guardian (array of student IDs)
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'instructor', 'student', 'guardian'], 
    default: 'student' 
  },
  studentId: { type: String }, 
  children: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
```

### 2.3 Create Live Class Model (`src/models/LiveClass.ts`)

```typescript
import mongoose, { Schema } from 'mongoose';

const LiveClassSchema = new Schema({
  title: { type: String, required: true },
  course: { type: String, required: true }, // Or match your Course Model ID
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // in minutes
  platform: { type: String, enum: ['zoom', 'meet'], default: 'zoom' },
  meetingLink: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.model('LiveClass', LiveClassSchema);
```

---

## 🔐 Phase 3: Authentication & Security

### 3.1 Auth Middleware (`src/middlewares/authMiddleware.ts`) title
Protect routes so only logged-in users (or specific roles) can access them.

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded; // Add user to request object
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

---

## ⚙️ Phase 4: Building the API (`src/app.ts`)

```typescript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Allow Frontend to access Backend
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 🔗 Phase 5: Connecting Frontend to Backend

Now, you replace the **MOCK** logic in your frontend with **REAL** API calls.

### 5.1 Environment Variables
In your Next.js project (`.env.local`), add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5.2 Create an Axios Instance
Create `lib/axios.ts` in your frontend:

```typescript
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

### 5.3 Update Login Logic (`components/Auth/Login.tsx`)

**Before (Mock):**
```typescript
if (phoneNumber == "017..." && password == "admin123") ...
```

**After (Real):**
```typescript
import api from '@/lib/axios';

const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const { data } = await api.post('/auth/login', { 
            phone: credentials.loginInput, 
            password: credentials.password 
        });
        
        // Save real data from DB
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role);

        // Redirect...
        router.push(getDashboardUrl(data.user.role));
    } catch (err) {
        setError(err.response?.data?.message || "Login failed");
    } finally {
        setIsLoading(false);
    }
};
```

---

## 🚀 Phase 6: Deployment Checklist

1.  **Database:** Create a free cluster on **MongoDB Atlas**. Get the connection string.
2.  **Backend Host:** Deploy your Node.js app to **Render**, **Railway**, or **Heroku**.
    *   Set environment variables (`MONGO_URI`, `JWT_SECRET`) on the hosting platform.
3.  **Frontend Update:**
    *   Update `NEXT_PUBLIC_API_URL` in your Vercel/Hostinger environment variables to point to your **new live backend URL** (e.g., `https://my-backend.onrender.com/api`).
    *   Rebuild and deploy the frontend.

## 📝 Next Steps for You
1.  **Start Coding:** Initialize the `backend` folder as described in Phase 1.
2.  **Test Locally:** Run backend (`npm run dev`) and frontend (`npm run dev`) together.
3.  **Replace Mock Data:** Gradually replace the static arrays in `StudentDashboard.tsx` and `InstructorDashboard.tsx` with `useEffect` hooks that fetch data using your new `api` client.
