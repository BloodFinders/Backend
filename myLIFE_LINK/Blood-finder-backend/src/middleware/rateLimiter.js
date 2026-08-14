/**
 * rateLimiter.js
 * Centralised, env-configurable rate limiters.
 *
 * All thresholds are read from environment variables so they can be tuned
 * per deployment without touching code.
 *
 * Hierarchy (strictest → loosest):
 *   otpLimiter          → OTP verification / password reset  (5 req / 10 min per IP)
 *   authStrictLimiter   → login / register / forgot-password (10 req / 15 min per IP)
 *   generalLimiter      → all other /api/* routes            (200 req / 15 min per IP)
 */

const rateLimit = require('express-rate-limit');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Read a positive integer from an env var, falling back to `defaultVal`. */
const envInt = (key, defaultVal) => {
  const val = parseInt(process.env[key], 10);
  return Number.isFinite(val) && val > 0 ? val : defaultVal;
};

/** Standard JSON error shape used across the whole API. */
const rateLimitHandler = (req, res, /*next*/ _, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
  });
};

// ── General limiter — applied to ALL /api/* routes ───────────────────────────
const generalLimiter = rateLimit({
  windowMs: envInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // default 15 min
  max: envInt('RATE_LIMIT_MAX', 200),                        // default 200 req
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  handler: rateLimitHandler,
});

// ── Auth strict limiter — login / register / forgot-password ─────────────────
const authStrictLimiter = rateLimit({
  windowMs: envInt('AUTH_RATE_WINDOW_MS', 15 * 60 * 1000), // default 15 min
  max: envInt('AUTH_RATE_MAX', 10),                         // default 10 req
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  handler: rateLimitHandler,
  // Skip successful requests so the counter only tracks failed/suspicious traffic
  skipSuccessfulRequests: false,
});

// ── OTP limiter — verify-otp / reset-password ────────────────────────────────
const otpLimiter = rateLimit({
  windowMs: envInt('OTP_RATE_WINDOW_MS', 10 * 60 * 1000), // default 10 min
  max: envInt('OTP_RATE_MAX', 5),                          // default 5 req
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many OTP attempts from this IP, please try again after 10 minutes.',
  handler: rateLimitHandler,
});

module.exports = { generalLimiter, authStrictLimiter, otpLimiter };
