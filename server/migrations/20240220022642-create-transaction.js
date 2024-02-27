'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
      },
      itemId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'items',
          key: 'id',
          as: 'itemId',
        },
      },
      bidId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'bids',
          key: 'id',
          as: 'bidId',
        },
      },
      addressId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'addresses',
          key: 'id',
          as: 'addressId',
        },
      },
      transactionCode: {
        type: Sequelize.STRING
      },
      totalPayment: {
        type: Sequelize.DECIMAL(20,2)
      },
      bidPrice: {
        type: Sequelize.DECIMAL(20,2)
      },
      shippingPrice: {
        type: Sequelize.DECIMAL(20,2)
      },
      shippingjson: {
        type: Sequelize.JSON
      },
      shippingId: {
        type: Sequelize.STRING
      },
      paymentId: {
        type: Sequelize.STRING
      },
      paymentJson: {
        type: Sequelize.JSON
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};