const { Op, where } = require("sequelize");
const { calculateDiscountAndTotalAmountFromItems } = require("../../helpers/calculateDiscount");
const { generatePdf } = require("../../helpers/generatePdfFromPuppeteer");
const {InvoiceItemModel} = require("../../models/index");
const {InvoiceModel} = require("../../models/index");
const moment = require("moment");
const uuid = require("uuid");

const addInvoiceService = async (reqBody) => {
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerAddress,
      invoiceDate,
      discountPercentage,
      taxPercentage,
      paymentStatus,
    } = reqBody;

    let createInvoiceJson = {
      customerName: customerName,
      customerEmail: customerEmail,
      customerAddress: customerAddress,
      invoiceId: uuid.v4(),
      taxPercentage: taxPercentage,
      discountPercentage: discountPercentage,
      invoiceDate: invoiceDate,
      paymentStatus: paymentStatus || 'pending',
    };

    let calculateFinalPrice = calculateDiscountAndTotalAmountFromItems(
      discountPercentage,
      taxPercentage,
      items
    );
    createInvoiceJson.totalAmount = calculateFinalPrice.totalAmount;
    createInvoiceJson.taxAmount = calculateFinalPrice.taxAmount;
    createInvoiceJson.discountAmount = calculateFinalPrice.discountAmount;
    createInvoiceJson.subTotalAmount = calculateFinalPrice.subTotalAmount

    let createInvoice = await InvoiceModel.create(createInvoiceJson);

    await Promise.all(
      items.map((item) => {
        InvoiceItemModel.create({
          invoiceFK: createInvoice.dataValues.invoiceNo,
          itemName: item.itemName,
          itemQuantity: item.itemQuantity,
          unitPrice: item.unitPrice,
        });
      })
    );

    return 1; // Invoice created successfully
  } catch (error) {
    console.log("error in adding invoice service ", error);
    throw new Error("Internal server error");
  }
};

const getInvoiceDetails = async (reqBody)=> {
  try {

    const {invoiceId} = reqBody;
    
    const findInvoice = await InvoiceModel.findOne({
      where: {
        invoiceId: invoiceId,
        isDeleted: false
      },
      include: [
        {
          model: InvoiceItemModel,
          as: "items"
        }
      ]
    });

    if (findInvoice != null) {

      
      let invoiceWithDateFormatting = {
        ...findInvoice.dataValues,
        invoiceDate: moment(findInvoice.invoiceDate).format('DD/MM/YYYY'),
      }
      
      return invoiceWithDateFormatting;
    } else {
      return 0;
    }
  } catch(error) {
    console.log("Error in fetching invoice detials ", error);
    throw new Error("Error in fetching the invoice details");
  }
};

const generatePdfForDownload = async (reqBody) => {
  try {
    const {invoiceId} = reqBody;

    const getInvoiceData = await getInvoiceDetails({invoiceId: invoiceId});
    return getInvoiceData;
    
  } catch (error) {
    console.log("Error in generating pdf ", error);
    throw new Error("Error in generating pdf from the data provided");
  }
}

const listInvoices = async (reqParams) => {
  try {
    const {
      pageNo,
      pageLimit,
      startDate,
      endDate,
      paymentStatus,
      searchStr,
      sortInvoiceBy = 'invoiceDate',
      sortOrder = 'DESC'
    } = reqParams;

    const offset = (Number(pageNo) - 1) * Number(pageLimit);
    const limit = Number(pageLimit);

    let buildDynamicWhereCondition = {};

    if (startDate && endDate) {
      buildDynamicWhereCondition.invoiceDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    }

    if (paymentStatus) {
      buildDynamicWhereCondition.paymentStatus = paymentStatus
    }

    if (searchStr) {
      buildDynamicWhereCondition[Op.or] = [
        {
          invoiceNo: {
            [Op.like]: `%${searchStr}%`
          }
        },
        {
          customerName: {
            [Op.like]: `%${searchStr}%`
          }
        },
      ]
    }

    const listInvoices = await InvoiceModel.findAndCountAll({
      where: buildDynamicWhereCondition,
      include: [
        {
          model: InvoiceItemModel, 
          as: 'items'
        }
      ],
      limit: limit,
      distinct: true,
      offset,
      order: [[sortInvoiceBy, sortOrder]]
    });

    return listInvoices;
  } catch (error) {
    console.log("Error in listing invoices ", error);
    throw new Error("Error in listing invoices");
  }
}

module.exports = {
    addInvoiceService,
    getInvoiceDetails,
    generatePdfForDownload,
    listInvoices,
}