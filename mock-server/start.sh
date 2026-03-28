#!/bin/bash

echo ""
echo "========================================"
echo "   SwiftBet Mock Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: npm install failed!"
        exit 1
    fi
    echo ""
fi

echo "Starting server on http://localhost:3001"
echo ""
echo "Available endpoints:"
echo "  - GET  http://localhost:3001/health"
echo "  - GET  http://localhost:3001/api-v2/today-sport-types/m/1/trader123"
echo "  - GET  http://localhost:3001/api-v2/left-menu/m/1/trader123"
echo "  - GET  http://localhost:3001/api-v2/upcoming-events/m/1/trader123"
echo "  - POST http://localhost:3001/api/user/sportsBet/info"
echo ""
echo "Test endpoints at: http://localhost:3001/test.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
