import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { dbConnection } from './database/connection.js';
import authRoutes from './routes/auth-route.js';
import memberRoutes from './routes/member-route.js';

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: "https://multiplysystem.onrender.com", // Your frontend URL (adjust if different)
    credentials: true,  // Allow cookies
}));

dotenv.config();

// Database connection
dbConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/member', memberRoutes);

// Start server
app.listen(process.env.PORT || 3001, () => {
    console.log("Listening on port 3001");
});
