require('dotenv').config({ path: './.secrets/.env' }); // Use this if using a .env file

const http = require('http');
const path = require("path")
const port = process.env.PORT
const get_email = require("./utils/get_email")
const email_parser = require("./utils/email_parser");
const pdf_parser = require("./utils/pdf_parser");
const update_column = require("./utils/update_email")

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
      const boardId = json.event.boardId
      const pulseId = json.event.pulseId
      const noteId = json.event.pulseId
      const workOrderId = json.event.pulseId
      // console.log(boardId)

      // console.log(typeof(pulseId))
      // UTIL FOR GET THE EMAIL COLUMN VALUES
      // const message = await get_email(pulseId)
      // console.log(message)
      // const email_path = path.join(__dirname, "./assets/email.txt")
      // const pdf_path = path.join(__dirname, "./assets/work_order.pdf")
      
      // console.log(result)
      // UTIL FOR SET THE EMAIL COLUMN VALUES
      // console.log(email_path)
      // const email = await email_parser(email_path)
      // console.log(email)
      // const invoice = await pdf_parser(pdf_path)

      // const result = await update_column(boardId,pulseId,noteId,email,workOrderId,invoice)
      // console.log(result)

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