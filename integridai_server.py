#!/usr/bin/env python3
"""
Custom HTTP server for IntegridAI Landing page to handle asset routing correctly
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys
from urllib.parse import unquote

class IntegridAIHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='/home/user/integridai-hackai-2025', **kwargs)

    def do_GET(self):
        # Parse the path
        path = unquote(self.path)
        
        # Handle root path
        if path == '/' or path == '/integridai-landing-real/' or path == '/integridai-landing-real':
            self.path = '/integridai-landing-real/index.html'
        
        # Handle asset requests - redirect /assets/... to /integridai-landing-real/assets/...
        elif path.startswith('/assets/'):
            self.path = f'/integridai-landing-real{path}'
        
        # Handle requests already prefixed with /integridai-landing-real/
        elif not path.startswith('/integridai-landing-real/') and not path.startswith('/flaisimulator-fixed/') and not path.startswith('/hackai-portal/'):
            # For any other path that's not already properly prefixed, assume it's for integridai-landing-real
            if not os.path.exists(os.path.join('/home/user/integridai-hackai-2025', path.lstrip('/'))):
                self.path = '/integridai-landing-real/index.html'
        
        # Call the parent implementation
        return super().do_GET()

    def log_message(self, format, *args):
        # Custom logging
        sys.stdout.write(f"{self.address_string()} - [{self.log_date_time_string()}] {format%args}\n")
        sys.stdout.flush()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3008
    server_address = ('0.0.0.0', port)
    
    print(f"Starting IntegridAI server on port {port}")
    print(f"Serving directory: /home/user/integridai-hackai-2025")
    sys.stdout.flush()
    
    httpd = HTTPServer(server_address, IntegridAIHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\nServer stopped on port {port}")
        httpd.server_close()