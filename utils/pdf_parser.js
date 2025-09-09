require('dotenv').config({ path: '../.secrets/.env' });


const fs = require("fs");
const path = require("path")
const pdfParse = require("pdf-parse");

module.exports = pdf_parser = async (filePath) => {
    const pdfBuffer = fs.readFileSync(filePath);

    const invoice = await pdfParse(pdfBuffer)
    return invoice
}


// Example Usage 
// const pdf_path = process.env.PDF_PATH;

// const func = async () => {
//     const result = await pdf_parser(pdf_path);
//     console.log(result)
// }
// console.log(func())
