const fs = require('fs').promises;
const path = require("path")

module.exports = email_parser = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    const lines = text.split('\n');
    const data = {};

    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        data[key.trim()] = rest.join(':').trim();
      }
    });

    return JSON.stringify(data, null, 2);
  } catch (err) {
    // Proper error propagation
    return Promise.reject(err);
  }
};

// Example usage:
// const filePath = path.join(__dirname, '../assets/email.txt')
// parseTextToJSON(filePath)
//   .then(jsonString => {
//     console.log('JSON:', jsonString);
//   })
//   .catch(err => {
//     console.error('Error:', err.message);
//   });
