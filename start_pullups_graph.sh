#!/bin/bash

# Absolute path to the project directory
PROJECT_DIR="/home/twain/Projects/pullups_graph"
SERVER_SCRIPT="$PROJECT_DIR/serve.py"
URL="http://localhost:8000"

# Check if the server is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Server is already running on port 8000"
else
    echo "Starting server..."
    # Start the server in the background
    cd "$PROJECT_DIR" && nohup python3 "$SERVER_SCRIPT" > /dev/null 2>&1 &
    # Give the server a moment to start
    sleep 1
    echo "Server started"
fi

# Open the browser
echo "Opening browser to $URL"
xdg-open "$URL" 2>/dev/null || sensible-browser "$URL" 2>/dev/null || x-www-browser "$URL" 2>/dev/null || echo "Could not detect browser. Please open $URL manually."