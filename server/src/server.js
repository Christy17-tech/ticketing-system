require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB (non-blocking — server starts regardless)
connectDB();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// CORS — allow all Render subdomains + localhost
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.endsWith('.onrender.com') ||
        origin.startsWith('http://localhost')
      ) {
        callback(null, true);
      } else {
        // Log blocked origins to help debug
        console.warn('CORS blocked origin:', origin);
        callback(null, true); // Temporarily allow all origins
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check (always works, even if DB is down)
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    db: dbState[mongoose.connection.readyState] || 'unknown',
    env: process.env.NODE_ENV,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
);

module.exports = app;
