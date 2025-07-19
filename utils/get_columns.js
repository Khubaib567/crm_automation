const axios = require('axios');
const fs = require('fs');
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

    // const [{ updates }] = response.data.data.items;
    console.log(response.data);
    // const email = JSON.stringify(updates, null, 2)
    // fs.writeFile('email.json', email, (err) => {
    //   if (err) {
    //     console.error('Error writing file', err);
    //   } else {
    //     console.log('Successfully saved updates to email.json');
    //   }
    // });
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
  }
}

const PULSE_ID = process.env.PULSE_ID
fetchEmail(PULSE_ID);
