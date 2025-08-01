const fs = require("fs");
const pdfParse = require("pdf-parse");

module.exports = pdf_parser = (filePath) => {
    const pdfBuffer = fs.readFileSync(filePath);

    pdfParse(pdfBuffer).then(data => {
        // console.log(data.text);
        return data.text
    });
}


// Example Usage 
// const pdfFile = "../assets/work_order.pdf";
// pdf_parser(pdfFile);
