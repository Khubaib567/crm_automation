require('dotenv').config({ path: '../.secrets/.env' });

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const email_parser = require("../utils/email_parser")

module.exports = parser = async (filePath) => {
    try {
        const pdfBuffer = fs.readFileSync(filePath);

        // pdf-parse needs a buffer as input and returns a promise
        const invoice = await pdfParse(pdfBuffer);
        const invoiceText = invoice.text;

        // Regex to find all Purchase Order numbers (e.g., PO: 123456)
        const poRegex = /P\.O\.\s*#:\s*(\d{6})\b/gi;
        const poMatches = [...invoiceText.matchAll(poRegex)];
        const poNumbers = poMatches.map(match => match);

        // Regex to find all Work Order numbers (e.g., Work order: 987654)
        const woRegex = /WO:\s*(\d{6})\b|Work order:\s*(\d{6})\b/gi;
        const woMatches = [...invoiceText.matchAll(woRegex)];
        const woNumbers = woMatches.map(match => match);
        const email_path = path.join(__dirname, process.env.EMAIL_PATH);
        const email = await email_parser(email_path)

        const numberRegex = /\d+/; // Matches one or more digits

        const matchResult1 = poNumbers[0][0].match(numberRegex);
        const poNumber = matchResult1 ? parseInt(matchResult1[0], 10) : null;

        const matchResult2 = woNumbers[0][0].match(numberRegex);
        const woNumber = matchResult2 ? parseInt(matchResult2[0], 10) : null;


        // Return both PO and WO numbers
        return {
            buffer : pdfBuffer,
            email : email ,
            purchaseOrders: poNumber,
            workOrders: woNumber
        };

    } catch (error) {
        console.error("Error parsing PDF:", error.message);
        return {
            error: error.message
        };
    }
}

// Example Usage 
// const pdf_path = "../assets/work_order.pdf";

// const func = async () => {
//     const result = await parser(pdf_path);
//     console.log(result);
// }

// func();
