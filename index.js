require('dotenv').config({path : './.secrets/.env'}); // Use this if using a .env file

const http = require('http');
const port = process.env.PORT

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let body = '';

    // Listen for data events to collect the incoming data
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    // EVENT LISTENER TO COMPLETE THE REQUEST.
    req.on('end', () => {
      // LOG THE REQUEST RESPONSE TO VERIFY WEBHOOKS IS WORKING.
      console.log(JSON.parse(body)); 
      // UPDATE THE COLUMN LOGIC HERE.

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end("Content has been updated!"); // SEND RESPONSE.
    });
  } else {
    // Handle other methods or routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end('Not Found');
  }
});

// Start the server on port 3000
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});