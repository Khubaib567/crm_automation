require('dotenv').config({ path: '../.secrets/.env' });

const axios = require('axios');
const { Console } = require('console');
const FormData = require('form-data');
const fs = require('fs');

// Replace with your actual values
const API_TOKEN = process.env.API_TOKEN;
const API_URL = process.env.API_URL + '/file' ;
// console.log(API_URL)

module.exports =  uploadFile = async ( ITEM_ID, COLUMN_ID , FILE) =>  {
  try {
    
    // console.log(FILE)
    // Create a new FormData instance
    const form = new FormData();

    // 1. Define the GraphQL query
    const query = `
      mutation ($file: File!, $item_id: ID!, $column_id: String!) {
        add_file_to_column(
          item_id: $item_id,
          column_id: $column_id,
          file: $file
        ) {
          id
        }
      }
    `;
    form.append('query', query);

    // 2. Define the variables
    const variables = {
      item_id: ITEM_ID,
      column_id: COLUMN_ID,
      // file : FILE

    };
    form.append('variables', JSON.stringify(variables));

    // 3. Define the variable mapping for the file upload
    const map = {
      "file": ["variables.file"]
    };
    form.append('map', JSON.stringify(map));

    // 4. Add the file buffer to the request
    form.append('file', FILE, {
      filename: 'work_order.pdf',
      contentType: 'application/pdf',
    });

    // 5. Use axios to send the request
    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        Authorization: API_TOKEN,
        // The form-data library provides the correct Content-Type header with boundary
        ...form.getHeaders(),
        // Note: The API-Version header is optional but can be added if needed
        'API-Version': '2025-07'
      },
      data: form
    });

    return JSON.stringify(response.data, null, 2);

  } catch (err) {
    if (axios.isAxiosError(err)) {
      // Handle Axios-specific errors
      console.error('Axios error:', err.response?.data || err.message);
    } else {
      console.error('An unexpected error occurred:', err);
    }
  }
}
