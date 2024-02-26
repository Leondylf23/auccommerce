"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("items", "status", {
      type: Sequelize.ENUM('DEACTIVATED','ACTIVED','LIVE'),
    });
    await queryInterface.addColumn("items", "itemStartBidDate", {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("status");
    await queryInterface.removeColumn("itemStartBidDate");
  },
};
