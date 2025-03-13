const express = require("express");
const router = express.Router();
const {
  addInvoiceController,
  getInvoiceDetailsController,
  generatePdfForDownloadController,
  listInvoicesController,
  viewInvoiceController,
  sendPdfToUserInMail,
  sendPdfToUserInMailController,
} = require("../../controllers/invoice/index");
const { validateFormValues } = require("../../middleware/validateRequestBody");
const InvoiceValidationSchema = require("../../validationSchemas");

router.post(
  "/add",
  validateFormValues(InvoiceValidationSchema),
  addInvoiceController
);

router.post("/fetch", getInvoiceDetailsController);

router.get("/downloadPdf/:invoiceId", generatePdfForDownloadController);

router.post("/list", listInvoicesController);

router.get('/view/:invoiceId', viewInvoiceController)

router.post('/sendInvoice', sendPdfToUserInMailController)

module.exports = router;
