const axios = require('axios');
const fs = require('fs');
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
module.exports = fetchEmail = async (PULSE_ID) => {
  const query = queryData(PULSE_ID)
  // console.log(queryData)
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

    const text  = response.data.data.items[0].updates[0].body;
    // console.log(response.data.data.items[0].updates[0].body);
    const email = convert(text)
    // console.log(email)
    return new Promise((resolve, reject) => {
    fs.writeFile('./assets/email.txt', email, (err) => {
      if (err) {
        return reject("Error writing file");
      }
      return resolve("Successfully saved updates to email.txt!");
    });
  });
  } catch (error) {
    Error("Error fetching data:", error.response?.data || error.message);
  }
}

// const PULSE_ID = process.env.PULSE_ID
// fetchEmail(PULSE_ID);
