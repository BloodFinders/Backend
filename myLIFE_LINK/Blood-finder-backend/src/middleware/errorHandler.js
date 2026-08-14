/**
 * errorHandler.js
 * Global error handler middleware.
 *
 * Rules:
 *  - Always log the full error (including stack) server-side for debugging.
 *  - In production: only return a generic message for unexpected (5xx) errors
 *    so that stack traces, DB field names, and file paths never reach the client.
 *  - 4xx errors that are intentionally user-facing (CastError, duplicate key,
 *    ValidationError) are safe to surface with a descriptive message.
 */
const errorHandler = (err, req, res, next) => {
  // ── Server-side logging (always full detail) ────────────────────────────
  console.error('[API Error]', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  let statusCode = err.statusCode || 500;
  let clientMessage = err.message || 'Server Error';

  // ── Mongoose bad ObjectId ───────────────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 404;
    clientMessage = 'Resource not found.';
  }

  // ── Mongoose duplicate key ──────────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    clientMessage = 'A record with that value already exists.';
  }

  // ── Mongoose validation error ───────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    clientMessage = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // ── JWT errors ──────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    clientMessage = 'Not authorized, token failed.';
  }

  // ── In production: never expose internal details for 5xx errors ─────────
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && statusCode >= 500) {
    clientMessage = 'An internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
};

module.exports = errorHandler;
