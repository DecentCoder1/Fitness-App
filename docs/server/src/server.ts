import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bookingRoutes from './routes/booking'; // Import booking routes

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
(async () => {
  try {
    await connectDB();
    console.log('Database connected successfully!');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }
})();

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/bookings', bookingRoutes); // Add booking routes

// Error Handling Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
