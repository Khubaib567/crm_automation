const fs = require("fs");
const pdfParse = require("pdf-parse");

function extractTextFromPDF(filePath) {
    const pdfBuffer = fs.readFileSync(filePath);

    pdfParse(pdfBuffer).then(data => {
        console.log(data.text);
    });
}

const pdfFile = "../assets/email.pdf";
extractTextFromPDF(pdfFile);
