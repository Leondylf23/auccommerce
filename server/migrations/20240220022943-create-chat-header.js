'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chatHeaders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userIdOrigin: {
        allowNull:false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
      },
      userIdDest: {
        allowNull:false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
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
    await queryInterface.dropTable('chatHeaders');
  }
};