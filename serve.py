#!/usr/bin/env python3
"""
Simple HTTP server that serves the pullups graph application
and provides access to the Pullups.md file via CORS.
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse, parse_qs

PORT = 8000
PULLUPS_FILE = '/home/twain/noteVault/Pullups.md'
CHESS_FILE = '/home/twain/noteVault/PuzzleRushApnea.md'
PUSHUPS_FILE = '/home/twain/noteVault/Pushups.md'
PUSHUPS_PREDATA_FILE = '/home/twain/noteVault/pushups_predata.json'

class PullupsHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow file access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_GET(self):
        # Check if requesting the pullups data
        if self.path == '/api/pullups':
            try:
                with open(PULLUPS_FILE, 'r') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(content.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Pullups.md file not found')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error reading file: {str(e)}'.encode())
        # Check if requesting the chess data
        elif self.path == '/api/chess':
            try:
                with open(CHESS_FILE, 'r') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(content.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'PuzzleRushApnea.md file not found')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error reading file: {str(e)}'.encode())
        # Check if requesting the pushups data
        elif self.path == '/api/pushups':
            try:
                with open(PUSHUPS_FILE, 'r') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(content.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Pushups.md file not found')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error reading file: {str(e)}'.encode())
        # Check if requesting the pushups predata
        elif self.path == '/api/pushups/predata':
            try:
                with open(PUSHUPS_PREDATA_FILE, 'r') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(content.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'pushups_predata.json file not found')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error reading file: {str(e)}'.encode())
        else:
            # Serve regular files
            super().do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), PullupsHandler) as httpd:
        print(f"🚀 Progress Tracker Server running at http://localhost:{PORT}")
        print(f"📊 Reading pullups data from: {PULLUPS_FILE}")
        print(f"♟️  Reading chess data from: {CHESS_FILE}")
        print(f"💪 Reading pushups data from: {PUSHUPS_FILE}")
        print(f"📜 Reading pushups predata from: {PUSHUPS_PREDATA_FILE}")
        print(f"Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")