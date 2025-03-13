const { connectionInstance } = require("../databaseConnection");
const { DataTypes, DatabaseError } = require("sequelize");
// const ItemModel = require('./invoiceItemModel');
const InvoiceItemModel = require("./invoiceItemModel");

module.exports = (sequelize, DataTypes) => {
const InvoiceModel = sequelize.define("InvoiceModel", {
  invoiceNo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  invoiceId: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    unique: true,
  },

  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  customerName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  customerAddress: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  customerEmail: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  taxPercentage: {
    type: DataTypes.DECIMAL(5,2),
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5,2),
    defaultValue: 0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  subTotalAmount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('paid', 'pending'),
    defaultValue: 'pending',
    allowNull: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
    timestamps: true,
    tableName: "invoiceDetails"
});

InvoiceModel.associate = (models) => {
  InvoiceModel.hasMany(models.InvoiceItemModel, { foreignKey: 'invoiceFK', as: 'items' });
};

return InvoiceModel
}

