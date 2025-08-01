const axios = require('axios');
require('dotenv').config({path : '../.secrets/.env'}); // Use this if using a .env file

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;
// console.log(API_TOKEN)

// Function to update column value on Monday.com
async function update_email(boardId , itemId, columnId, value) {
    const headers = {
        "Authorization": API_TOKEN,
        "Content-Type": "application/json"
    };

    const query = `
    mutation ($boardId: ID! , $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(
            board_id : $boardId
            item_id: $itemId, 
            column_id: $columnId, 
            value: $value
        ) {
            id
        }
    }`;

    const variables = {
        boardId: boardId,
        itemId: itemId,
        columnId: columnId,
        value: value
    };

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
// const boardId = 2051694766
// const itemId = 2051699796;
// const columnId = "text9";
// const value = {"message": "Email Description"};

// update_email(boardId, itemId, columnId, value)
//     .then(response => {
//         console.log(response);
//     });

