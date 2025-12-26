#!/bin/bash

echo "========================================"
echo " MilkMan Automation Tests - Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js is installed"
node --version
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "[INFO] .env file already exists"
    echo ""
else
    echo "[INFO] Creating .env file from template..."
    cp .env.example .env
    echo "[OK] .env file created"
    echo ""
fi

# Install dependencies
echo "[INFO] Installing dependencies..."
echo "This may take a few minutes..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Ensure MilkMan application is running:"
echo "     docker-compose up -d"
echo ""
echo "  2. Run tests:"
echo "     npm test              (All tests)"
echo "     npm run test:api      (API tests only)"
echo "     npm run test:ui       (UI tests only)"
echo ""
echo "  3. View reports:"
echo "     npm run report"
echo ""
echo "For more information, see README.md or QUICKSTART.md"
echo ""
