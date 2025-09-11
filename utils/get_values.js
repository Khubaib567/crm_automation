const axios = require('axios');
const fs = require('fs');
const path = require("path")
const { convert } = require('html-to-text');
require('dotenv').config({path : '../.secrets/.env'}); // Use this if using a .env file


// Replace with your Monday.com API token
const API_TOKEN = process.env.API_TOKEN

const queryData = (PULSE_ID) => {
// Define your GraphQL query
const query = `
query {
  items(ids: ${PULSE_ID}) {
    id
    name
    column_values {
      id
      text
      value
    }
    updates {
      id
      body
      created_at
    }
  }
}
`;
  return query
}

// Function to fetch data from Monday.com
module.exports = get_values = async (PULSE_ID) => {
  const query = queryData(PULSE_ID)
  // console.log(query)
  try {
    const response = await axios.post(
      'https://api.monday.com/v2',
      { query : query },
      {
        headers: {
          Authorization: API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    let obj = {}
    const text  = response.data.data.items[0].updates[0].body;
    const emailID = response.data.data.items[0].column_values[3].id
    const fileID = response.data.data.items[0].column_values[5].id
    
    // console.log(emailID)

    obj = {
      emailID : emailID,
      fileID : fileID,
      
    }

    // console.log(response.data.data.items[0].updates[0].body);
    const email = await convert(text)
    // console.log(email)
    const filePath = path.join( __dirname, "../assets/email.txt")
    return new Promise((resolve, reject) => {
    fs.writeFile(filePath, email, (err) => {
      if (err) {
        return reject(err.message);
      }
      return resolve(obj);
    });
  });
  } catch (error) {
    Error("Error fetching data:", error.response?.data || error.message);
  }
}

// const PULSE_ID = process.env.PULSE_ID
// get_values(PULSE_ID);
