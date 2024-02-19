'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'phone', {
      type: Sequelize.STRING(20)
    });
    await queryInterface.addColumn('orders', 'address', {
      type: Sequelize.TEXT
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('phone');
    await queryInterface.removeColumn('address');
  }
};
