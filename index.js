require('dotenv').config({path : './.secrets/.env'}); // Use this if using a .env file

const http = require('http');
const port = process.env.PORT
const fetchEmail = require("./utils/get_email")

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let body = '';
    let json;

    // Listen for data events to collect the incoming data
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
      json = JSON.parse(body)
    });

    // EVENT LISTENER TO COMPLETE THE REQUEST.
    req.on('end', async () => {
      // LOG THE REQUEST RESPONSE TO VERIFY WEBHOOKS IS WORKING.
      // console.log(json.event.pulseId);
      const pulseId =  json.event.pulseId
      // console.log(typeof(pulseId))
      // UTIL FOR GET THE EMAIL COLUMN VALUES
      const email = await fetchEmail(pulseId)
      console.log(email)
      // UTIL FOR UPDATE THE OTHER COLUMN(S) VALUE HERE.
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(body); // SEND RESPONSE.
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