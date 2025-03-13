const handler = require('serve-handler');
const http = require('http');
const path = require('path');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: 'build',
    rewrites: [
      { source: '/**', destination: '/index.html' }
    ],
    cleanUrls: true,
    directoryListing: false
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Frontend running at http://0.0.0.0:3000');
}); 