const puppeteer = require("puppeteer");
const fs = require("fs");

const generatePdf = async (htmlPageData) => {
  try {
    const browserPage = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000,
    });

    const pdfPage = await browserPage.newPage();

    await pdfPage.setContent(htmlPageData, { waitUntil: 'networkidle0' });

    const getPdfPageBufferData = await pdfPage.pdf({ format: "A4" });

    console.log('getPdf ', getPdfPageBufferData);
    await browserPage.close();
    
    return getPdfPageBufferData;
  } catch (error) {
    console.log("Error in pdf generation by pupetteer");
    throw error;
  }
};

module.exports = {
  generatePdf,
};
