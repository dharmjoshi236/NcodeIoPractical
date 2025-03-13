const express = require('express');
const InvoiceRouter = require('./invoice/index');
const mainRouter = express.Router();

mainRouter.use("/invoice", InvoiceRouter);

module.exports = mainRouter;