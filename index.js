require('dotenv').config({ path: './.secrets/.env' }); // Use this if using a .env file

const http = require('http');
const path = require("path")
const port = process.env.PORT
const get_email = require("./utils/get_email")
const set_email = require("./utils/set_email")

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let body = '';
    let json;

    // Listen for data events to collect the incoming data
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
      json = JSON.parse(body)
      // console.log(json)
    });

    // EVENT LISTENER TO COMPLETE THE REQUEST.
    req.on('end', async () => {
      // LOG THE REQUEST RESPONSE TO VERIFY WEBHOOKS IS WORKING.
      // console.log(json.event.pulseId);
      const pulseId = json.event.pulseId
      // console.log(typeof(pulseId))
      // UTIL FOR GET THE EMAIL COLUMN VALUES
      const result = await get_email(pulseId)
      console.log(result)
      const finalPath = path.join(__dirname, result)
      // console.log(result)
      // UTIL FOR SET THE EMAIL COLUMN VALUES
      // console.log(finalPath)
      // const email = set_email(finalPath)
      // console.log(email)
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