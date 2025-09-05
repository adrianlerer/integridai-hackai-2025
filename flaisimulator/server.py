#!/usr/bin/env python3
"""
Simple HTTP Server for FlaiSimulator
Serves static files on port 3000
"""

import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = "/home/user/webapp/flaisimulator"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"FlaiSimulator server running at http://0.0.0.0:{PORT}/")
        sys.stdout.flush()
        httpd.serve_forever()