"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */

const passwordSaltRound = bcrypt.genSaltSync(12);
const __generateHashPassword = (password) =>
  bcrypt.hashSync(password, passwordSaltRound);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.TEXT,
        defaultValue: __generateHashPassword("Phincon123!"),
      },
      fullname: {
        type: Sequelize.STRING,
      },
      profileImage: {
        type: Sequelize.TEXT,
      },
      dob: {
        type: Sequelize.DATE,
      },
      role: {
        type: Sequelize.ENUM,
        values: ["customer", "business"],
        defaultValue: "customer",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
