'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.createTable('itemDetails', {
        itemId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        invoiceFK: {
          type: Sequelize.INTEGER,
          references: {
              model: "invoiceDetails",
              key: "invoiceNo"
          },
          onDelete: 'CASCADE'
        },
        itemName: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        unitPrice: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: false
        },
        itemQuantity: {
          type: Sequelize.INTEGER,
          allowNull: false
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
      });
     
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.dropTable('itemDetails');
  }
};
