/**
 * configCheck.js
 * Validates that all required environment variables are present on startup.
 */

const requiredEnvVars = [
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error(`[Config Error] Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('Environment variables validated successfully.');
};

module.exports = validateEnv;
