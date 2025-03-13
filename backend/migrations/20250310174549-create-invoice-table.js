'use strict';

const InvoiceModel = require('../models/invoiceModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('invoiceDetails', {
      invoiceNo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    
      invoiceId: {
        type: Sequelize.UUID,
        default: Sequelize.UUIDV4,
        unique: true,
      },
    
      invoiceDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    
      customerName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customerAddress: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      customerEmail: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      taxPercentage: {
        type: Sequelize.DECIMAL(5,2),
        defaultValue: 0,
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0,
      },
      discountPercentage: {
        type: Sequelize.DECIMAL(5,2),
        defaultValue: 0
      },
      discountAmount: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      subTotalAmount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('paid', 'pending'),
        defaultValue: 'pending',
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('invoiceDetails');
  }
};
