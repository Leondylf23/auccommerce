'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
      },
      storeRequestId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'storeRequests',
          key: 'id',
          as: 'storeRequestId',
        },
      },
      storeName: {
        type: Sequelize.STRING
      },
      storePicture: {
        type: Sequelize.TEXT
      },
      storeAddress: {
        type: Sequelize.TEXT
      },
      storePostalCode: {
        type: Sequelize.STRING
      },
      storeMap: {
        type: Sequelize.JSON
      },
      storeDescription: {
        type: Sequelize.TEXT
      },
      transactionCount: {
        type: Sequelize.BIGINT
      },
      responsePercentage: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('stores');
  }
};