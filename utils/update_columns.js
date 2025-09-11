const axios = require('axios');
require('dotenv').config({ path: '../.secrets/.env' });

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

// Function to update multiple column values on Monday.com
// The 'updates' parameter should be a JSON object, e.g., { "column_id_1": "new_value_1", "column_id_2": "new_value_2" }
module.exports = update_multiple_columns = async (boardId, itemId, updates) => {
    const headers = {
        "Authorization": API_TOKEN,
        "Content-Type": "application/json"
    };

    // The mutation uses a single 'column_values' variable which is a JSON string
    const query = `
    mutation ($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
        change_multiple_column_values(
            board_id: $boardId,
            item_id: $itemId,
            column_values: $columnValues
        ) {
            id
        }
    }`;

    // The updates object is converted to a JSON string here.
    const variables = {
        boardId: boardId,
        itemId: itemId,
        columnValues: JSON.stringify(updates)
    };

    try {
        const response = await axios.post(API_URL, {
            query: query,
            variables: variables
        }, { headers: headers });

        return response.data;
    } catch (error) {
        console.error("Error updating columns:", error.response ? error.response.data : error.message);
    }
};

// Example usage
// const boardId = 2051694766;
// const itemId = 2071201913;

// Define the updates as a JSON object with column IDs as keys
// Note: The format for the value depends on the column type.
// For a Text column, use a string: "New text value".
// For a Status column, use a JSON object with a label or index: { "label": "Working on it" }.
// const updates = {
//     "text_mkthmmjs": "Updated description via multiple columns",
    
//     // "status_col": { "label": "Working on it" },
//     // "numbers_col": "123"
// };

// update_multiple_columns(boardId, itemId, updates)
//     .then(response => {
//         if (response) {
//             console.log("Columns updated successfully:", response.data);
//         }
//     })
//     .catch(error => {
//         console.error("An error occurred during the update:", error);
//     });
