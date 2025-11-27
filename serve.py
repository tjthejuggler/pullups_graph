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
        else:
            # Serve regular files
            super().do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), PullupsHandler) as httpd:
        print(f"🚀 Pullups Graph Server running at http://localhost:{PORT}")
        print(f"📊 Reading data from: {PULLUPS_FILE}")
        print(f"Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")