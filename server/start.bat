@echo off
echo Starting SkillSwap Backend Server...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file...
    echo # Server Configuration > .env
    echo PORT=5000 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # Database Configuration >> .env
    echo MONGODB_URI=mongodb://localhost:27017/skillswap >> .env
    echo. >> .env
    echo # JWT Configuration >> .env
    echo JWT_SECRET=skillswap-super-secret-jwt-key-2024-hackathon >> .env
    echo JWT_EXPIRE=7d >> .env
    echo. >> .env
    echo # Client URL >> .env
    echo CLIENT_URL=http://localhost:3000 >> .env
    echo. >> .env
    echo # Rate Limiting >> .env
    echo RATE_LIMIT_WINDOW_MS=900000 >> .env
    echo RATE_LIMIT_MAX_REQUESTS=100 >> .env
    echo. >> .env
    echo # File Upload >> .env
    echo MAX_FILE_SIZE=5242880 >> .env
    echo .env file created successfully!
    echo.
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting server in development mode...
echo Server will be available at: http://localhost:5000
echo API Health Check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev 