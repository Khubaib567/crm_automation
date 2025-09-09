require('dotenv').config({ path: './.secrets/.env' });

const express = require('express');
const path = require("path");
const port = process.env.PORT;
const get_email = require("./utils/get_email");
const email_parser = require("./utils/email_parser");
const pdf_parser = require("./utils/pdf_parser");
const update_columns = require("./utils/update_columns");
const ngrok = require('@ngrok/ngrok');

const app = express();

// Use built-in middleware to parse JSON request bodies
app.use(express.json());

// FUNCTION TO VERIFY WEBHOOK
const verifyWebHook = (token) => {
try {
    const jwt = token.toString(); 
    return jwt;
  } catch (error) {
    console.error("Error verifying webhook:", error.message);
    return error.message;
  }
}

app.post("/" , async (req,res) => {
  try {
    const {challenge , event} = req.body

    if(challenge) {
    //  console.log(challenge)
     const token = challenge
     const jwt = await verifyWebHook(token);
    //  console.log(jwt)
     return res.status(200).json({challenge : jwt}); // Return here to stop further execution
    } 

    if(event) {
      // console.log(event)
      const { boardId, pulseId, noteId, workOrderId } = req.body.event;
      // UTIL FOR GET THE EMAIL COLUMN VALUES
      console.log("Received event for board:", boardId);
      const message = await get_email(pulseId);
      console.log(message);

      // CONFIGURE ASSETS PATH
      const email_path = path.join(__dirname, process.env.EMAIL_PATH);
      const pdf_path = path.join(__dirname, process.env.PDF_PATH);
      // console.log("Email_path: ",email_path)
      // console.log("Pdf_path: ",pdf_path)


      // UTIL FOR SET THE EMAIL COLUMN VALUES
      const email = await email_parser(email_path);
      const invoice = await pdf_parser(pdf_path);
      console.log(invoice)
    
      const result = await update_columns(boardId, pulseId, noteId, email, workOrderId, invoice);
      console.log("Result : " , result);
      
      // Send a 200 OK response to the webhook provider
      return res.status(200).send("Event received successfully");
      
    }

    // If neither a challenge nor an event is present, respond with a bad request status
    return res.status(400).send("Invalid webhook payload");
      
    } catch (error) {
      console.error("Error : ", error.message)
      return res.status(500).send("Internal Server Error");
  }
    
})

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Get your endpoint online
ngrok.connect({ addr: 8080, authtoken_from_env: true })
  .then(listener => console.log(`Ingress established at: ${listener.url()}`));
