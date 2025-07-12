#!/bin/bash

echo "Starting SkillSwap Backend Server..."
echo

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/skillswap

# JWT Configuration
JWT_SECRET=skillswap-super-secret-jwt-key-2024-hackathon
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
EOF
    echo ".env file created successfully!"
    echo
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

echo "Starting server in development mode..."
echo "Server will be available at: http://localhost:5000"
echo "API Health Check: http://localhost:5000/api/health"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev 