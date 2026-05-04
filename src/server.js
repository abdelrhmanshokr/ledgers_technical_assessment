/**
 * server.js
 * Entry point for the Express.js backend application.
 * Initializes the server and sets up middleware and routes.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Loads environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard middleware for parsing JSON and handling CORS
app.use(cors());
app.use(express.json());

// Basic health check route to verify server status
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Starts the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
