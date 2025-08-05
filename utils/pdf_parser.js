const fs = require("fs");
const pdfParse = require("pdf-parse");

module.exports = pdf_parser = async (filePath) => {
    const pdfBuffer = fs.readFileSync(filePath);

    const invoice = await pdfParse(pdfBuffer)
    return invoice
}


// Example Usage 
// const pdfFile = "../assets/work_order.pdf";
// pdf_parser(pdfFile);
