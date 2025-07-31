const axios = require('axios');
require('dotenv').config({path : '../.secrets/.env'}); // Use this if using a .env file

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

// Function to update column value on Monday.com
async function updateColumns(boardId, itemId, columnId, value) {
    const headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
    };

    const query = `
    mutation ($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(
            board_id: $boardId, 
            item_id: $itemId, 
            column_id: $columnId, 
            value: $value
        ) {
            id
        }
    }`;

    // const variables = {
    //     boardId: boardId,
    //     itemId: itemId,
    //     columnId: columnId,
    //     value: value
    // };

    try {
        const response = await axios.post(API_URL, {
            query: query,
            variables: variables
        }, { headers: headers });

        return response.data;
    } catch (error) {
        console.error("Error updating column:", error);
    }
}

// Example usage
const boardId = 1957521096;
const itemId = 2045932777;
const columnId = "project_status";
const value = '{"label": "Working on it"}';

// updateColumns(boardId, itemId, columnId, value)
//     .then(response => {
//         console.log(response);
//     });

