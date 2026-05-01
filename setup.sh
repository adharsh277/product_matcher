#!/bin/bash

# Smart Product Matcher - Complete Setup Script
# This script automates the setup process

echo "🚀 Smart Product Matcher - Auto Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd backend && npm start   (start the backend)"
echo "2. Open Chrome → chrome://extensions/"
echo "3. Enable Developer Mode"
echo "4. Click 'Load unpacked' → select 'extension' folder"
echo "5. Go to Amazon/Flipkart product page"
echo "6. Click extension icon → Compare Price"
echo ""
echo "Good luck! 🎉"
