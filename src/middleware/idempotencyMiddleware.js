/**
 * idempotencyMiddleware.js
 * Middleware to handle Idempotency-Key headers using Redis.
 */

const redis = require('../config/redis');

/**
 * Middleware to handle idempotency keys
 * Prevents duplicate processing of write requests.
 */
const idempotency = async (req, res, next) => {
  // Only apply to write operations (POST/PUT/PATCH/DELETE)
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    // Decision: Requirement says "Skip logic if header is missing (or enforce it)". 
    // For now we skip, but in production we might return 400.
    return next();
  }

  const redisKey = `idempotency:${idempotencyKey}:${req.user.id}:${req.originalUrl}`;

  try {
    // 1. Try to set the key as 'PROCESSING' with NX (only if it doesn't exist)
    // EX 60 means the lock expires in 60 seconds if the server crashes.
    const result = await redis.set(redisKey, 'PROCESSING', 'NX', 'EX', 60);

    if (!result) {
      // Key exists - check if it's still processing or has a result
      const val = await redis.get(redisKey);
      
      if (val === 'PROCESSING') {
        const error = new Error('Another request with the same Idempotency-Key is currently being processed');
        error.statusCode = 409;
        return next(error);
      }

      // If it has a cached response, return it
      try {
        const cachedResponse = JSON.parse(val);
        return res.status(cachedResponse.status).json(cachedResponse.body);
      } catch (e) {
        const error = new Error('Invalid idempotency record found');
        error.statusCode = 409;
        return next(error);
      }
    }

    // Attach functionality to the response object to save the result once the request is done
    const originalJson = res.json;
    res.json = function (body) {
      // Only cache successful or non-server-error responses (2xx, 4xx)
      if (res.statusCode < 500) {
        const ttl = 86400; // 24 hours
        redis.set(redisKey, JSON.stringify({ status: res.statusCode, body }), 'EX', ttl);
      } else {
        // If error, delete the processing key so the user can retry
        redis.del(redisKey);
      }
      return originalJson.call(this, body);
    };

    next();
  } catch (err) {
    console.error('Idempotency error:', err);
    next(); // Fallback: allow the request to proceed if redis fails
  }
};

module.exports = idempotency;
