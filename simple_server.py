from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

class CustomHeaderHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    with TCPServer(("", 8000), CustomHeaderHandler) as httpd:
        print("Server started at localhost:8000")
        httpd.serve_forever()

