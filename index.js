require('dotenv').config({path : './.secrets/.env'}); // Use this if using a .env file

const http = require('http');
const port = process.env.PORT

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    let body = null;

    // Listen for data events to collect the incoming data
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    // Listen for the end event to process the complete request
    req.on('end', () => {
      console.log(body); // Log the received body
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response: body })); // Send response
    });
  } else {
    // Handle other methods or routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server on port 3000
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});