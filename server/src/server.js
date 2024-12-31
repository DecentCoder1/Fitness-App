const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); // Load environment variables
const { connectDB } = require('./db/db'); // Import database connection

const app = express(); // Create an Express app

// Middleware
app.use(cors());
app.use(express.json()); // Built-in middleware to parse JSON

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to the database:', err);
  process.exit(1); // Exit if connection fails
});

// Routes
app.get('/', (req, res) => res.send('Welcome to the Fitness App API'));

app.get('/api/example', (req, res) => {
  const inputData = req.body || {}; // Handle undefined body
  const modelOutput = `Processed data: ${JSON.stringify(inputData)}`;
  res.json({ output: modelOutput });
});

// Start the server
const PORT = process.env.server_PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
