require('dotenv').config({ path: './.secrets/.env' });

const express = require('express');
const path = require("path");
const port = process.env.PORT;
const get_values = require("./utils/get_values");
// const email_parser = require("./utils/email_parser");
const pdf_parser = require("./utils/pdf_parser");
const uploadFile = require("./utils/uploadfile");
const update_multiple_columns = require("./utils/update_columns")
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
      const { boardId, pulseId } = req.body.event;
      // UTIL FOR GET THE EMAIL COLUMN VALUES
      console.log("Received event for board:", boardId);
      // console.log(obj.fileID);
      // console.log(noteId)

      // CONFIGURE ASSETS PATH
      const pdf_path = path.join(__dirname, process.env.PDF_PATH);
      // console.log(pdf_path)
      // console.log("Email_path: ",email_path)
      // console.log("Pdf_path: ",pdf_path)



      // UTIL FOR SET THE EMAIL COLUMN VALUES
      // const email = await email_parser(email_path);
      const obj = await get_values(pulseId);
      const pdf = await pdf_parser(pdf_path);

      // console.log(typeof(pdf))
      // console.log(email)
   
      // console.log(pdf.buffer)
      const result = await uploadFile(pulseId , obj.fileID, pdf.buffer)
      console.log("Result : " , result);

      const columns = await update_multiple_columns(boardId, pulseId , pdf.email , pdf.purchaseOrder , pdf.workOrder)
      console.log("Columns has been updated: " , columns)
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
