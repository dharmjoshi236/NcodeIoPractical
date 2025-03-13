const { generatePdf } = require("../../helpers/generatePdfFromPuppeteer");
const { sendPdfInMailToUser } = require("../../helpers/sendMailToUser");
const {
  addInvoiceService,
  getInvoiceDetails,
  generatePdfForDownload,
  listInvoices,
} = require("../../services/invoice/index");
const ejs = require("ejs");
const path = require("path");

const addInvoiceController = async (req, res) => {
  try {
    const callAddInvoiceService = await addInvoiceService(req.body);

    if (callAddInvoiceService == 1) {
      return res.status(200).json({
        data: {},
        message: "Invoice added successfully",
        status: 1,
      });
    }
  } catch (error) {
    console.log("error in add invoice controller ", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
      status: 0,
    });
  }
};
const getInvoiceDetailsController = async (req, res) => {
  try {
    const callInvoiceDetails = await getInvoiceDetails(req.body);

    if (callInvoiceDetails != 0) {
      return res.status(200).json({
        data: callInvoiceDetails,
        message: "Invoice fetched successfully",
        status: 1,
      });
    } else {
      return res.status(400).json({
        data: {},
        message: "No invoice found, with given id",
        status: 0,
      });
    }
  } catch (error) {
    console.log("error in add invoice controller ", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
      status: 0,
    });
  }
};
const generatePdfForDownloadController = async (req, res) => {
  try {
    const getInvoiceDetals = await getInvoiceDetails(req.params);

    if (getInvoiceDetals != 0) {
      const dynamicHtmlEjsTemplate = await ejs.renderFile(
        path.join(__dirname, "../../views", "invoiceTemplate.ejs"),
        getInvoiceDetals
      );

      const generatePdfBuffer = await generatePdf(dynamicHtmlEjsTemplate);
      const generatePdfName = `${req.params.invoiceId}_${Date.now()}.pdf`;

      const base64Pdf = Buffer.from(generatePdfBuffer).toString("base64");
      return res.status(200).json({
        data: { filename: generatePdfName, base64Pdf: base64Pdf },
        message: "Pdf fetched successfully",
        status: 1,
      });
    } else {
      return res.status(400).json({
        data: {},
        message: "No invoice found, with given Id",
        status: 0,
      });
    }
  } catch (error) {
    console.log("error in pdf generate controller ", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
      status: 0,
    });
  }
};

const listInvoicesController = async (req, res) => {
  try {
    const listInvoiceService = await listInvoices(req.body);

    if (listInvoiceService.count > 0) {
      return res.status(200).json({
        data: listInvoiceService,
        message: "List found",
        status: 1,
      });
    } else {
      return res.status(200).json({
        data: listInvoiceService,
        message: "No invoices list found",
        status: 1,
      });
    }
  } catch (error) {
    console.log("error in pdf generate controller ", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
      status: 0,
    });
  }
};

const viewInvoiceController = async(req, res)=> {
  try {
    const getInvoiceDetals = await getInvoiceDetails(req.params);

    if (getInvoiceDetals != 0) {
      const dynamicHtmlEjsTemplate = await ejs.renderFile(
        path.join(__dirname, "../../views", "invoiceTemplate.ejs"),
        getInvoiceDetals
      );

      return res.status(200).json({
        data: {
          htmlString: dynamicHtmlEjsTemplate,
          invoiceId: req.params.invoiceId
        },
        message: "Invoice viewed successfully",
        status: 1
      })
    } else {
      return res.status(400).json({
        data: {},
        message: "No invoice details found",
        status: 0
      })
    }
  } catch(error) {
    console.log("error in pdf generate controller ", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
      status: 0,
    });
  }
}

const sendPdfToUserInMailController = async (req, res)=> {
  try {
    const getInvoiceDetals = await getInvoiceDetails(req.body);

    if (getInvoiceDetals != 0) {
      const dynamicHtmlEjsTemplate = await ejs.renderFile(
        path.join(__dirname, "../../views", "invoiceTemplate.ejs"),
        getInvoiceDetals
      );

      const generatePdfBuffer = await generatePdf(dynamicHtmlEjsTemplate);
      const generatePdfName = `${req.body.invoiceId}_${Date.now()}.pdf`;

      const sendPdfAsAttachment = await sendPdfInMailToUser(generatePdfBuffer, getInvoiceDetals.customerEmail, getInvoiceDetals.invoiceId,generatePdfName);

      if(sendPdfAsAttachment == 1) {
        return res.status(200).json({
          data: {},
          message: "Invoice sent successfully to user",
          status: 1
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Unable to send invoice to mail",
          status: 0
        })
      }
    } else {
      return res.status(400).json({
        data: {},
        message: "No invoice details found",
        status: 0
      })
    }
  } catch(error) {
    console.log("error in sending pdf to user email ", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
      status: 0,
    });
  }
}

module.exports = {
  addInvoiceController,
  getInvoiceDetailsController,
  generatePdfForDownloadController,
  listInvoicesController,
  viewInvoiceController,
  sendPdfToUserInMailController,
};
