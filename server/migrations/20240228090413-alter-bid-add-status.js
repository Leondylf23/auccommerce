'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("bids", "status", {
      type: Sequelize.ENUM('PLACED', 'WAITING','FAILED','WAIT_PAYMENT', 'WAIT_CONFIRM', 'PROCESSING', 'SHIPPING', 'COMPLETED'),
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("status");
  }
};
