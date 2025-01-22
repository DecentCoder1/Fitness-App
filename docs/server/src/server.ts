import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import apiRoutes from './routes'; // Import the centralized routes file

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

// Use the centralized routes with /api prefix
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
