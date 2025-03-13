const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Frontend running at http://0.0.0.0:3000');
  console.log('Serving from:', path.join(__dirname, 'build'));
}); 