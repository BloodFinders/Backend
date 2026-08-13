const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// ── Critical env validation — crash early rather than silently use insecure defaults
const REQUIRED_ENV = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URI'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Please ensure your .env file is present and contains all required keys.');
  process.exit(1);
}

// DB Connection
const connectDB = require('./config/db');
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const donationRoutes = require('./routes/donationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bloodStockRoutes = require('./routes/bloodStockRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Error Handler Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser — 10kb limit to prevent DoS via oversized payloads
app.use(express.json({ limit: '10kb' }));

// Enable CORS — restrict to known origins only
const allowedOrigins = [
  // Add your production admin web dashboard URL here when deployed:
  // 'https://admin.rakthadan.com',
  'http://localhost:3000',       // Local web admin dev
  'http://localhost:19006',      // Expo web
  'http://192.168.1.19:8081',    // Expo Go local (dev only)
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Remainder', 'bypass-tunnel-reminder'],
  credentials: true,
}));

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting (15 minutes, max 500 requests for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 500,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blood-stock', bloodStockRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404 Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Mount error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
});

// Handle unhandled promise rejections (prevent corrupt state)
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit — process manager (PM2) will restart cleanly
  server.close(() => process.exit(1));
});
