const { connectionInstance } = require("../databaseConnection");
const { DataTypes } = require("sequelize");
const {InvoiceModel} = require('./invoiceModel')

module.exports = (sequelize, DataTypes) => {
const InvoiceItemModel = sequelize.define("InvoiceItemModel", {
  itemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  invoiceFK: {
    type: DataTypes.INTEGER,
    references: {
        model: InvoiceModel,
        key: "invoiceNo"
    },
    onDelete: 'CASCADE'
  },
  itemName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  itemQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
    timestamps: true,
    tableName: "itemDetails"
});
InvoiceItemModel.associate = (models) => {
  InvoiceItemModel.belongsTo(models.InvoiceModel, { foreignKey: 'invoiceFK', as: 'invoice' });
};
return InvoiceItemModel;
};