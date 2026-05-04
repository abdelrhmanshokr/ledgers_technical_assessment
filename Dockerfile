# Use Node.js 22 LTS as the base image
FROM node:22-slim

# Install OpenSSL 1.1.x (required for Prisma in debian-slim images)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the application port
EXPOSE 5000

# Start script handles migrations and starting the server
# We use a shell script to ensure the DB is ready before migrations run
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
