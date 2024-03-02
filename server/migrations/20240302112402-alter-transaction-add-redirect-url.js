'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("transactions", "paymentRedirUrl", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("transactions", "paymentDatas", {
      type: Sequelize.JSON,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("paymentRedirUrl");
    await queryInterface.removeColumn("paymentDatas");
  }
};
