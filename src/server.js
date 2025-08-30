// src/server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// ==============================
// Connect MongoDB
// ==============================
connectDB();

// ==============================
// Middlewares
// ==============================
app.use(helmet()); // security headers
app.use(morgan('dev')); // logs requests
app.use(express.json({ limit: '1mb' })); // parse JSON

// CORS (allow frontend URL from .env)
const allowed = (process.env.CLIENT_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowed.length ? allowed : '*',
    credentials: false,
  })
);

// Rate limiter (for auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});

// ==============================
// Routes
// ==============================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);

// ==============================
// Error Handler
// ==============================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('GlobalError:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
