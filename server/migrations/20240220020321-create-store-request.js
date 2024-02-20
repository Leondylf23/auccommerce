'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storeRequests', {
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
      storeName: {
        type: Sequelize.STRING
      },
      storePicture: {
        type: Sequelize.TEXT
      },
      storeAddress: {
        type: Sequelize.TEXT
      },
      storeDescription: {
        type: Sequelize.TEXT
      },
      storeMap: {
        type: Sequelize.JSON
      },
      storePostalCode: {
        type: Sequelize.STRING
      },
      userIdentityJson: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('storeRequests');
  }
};