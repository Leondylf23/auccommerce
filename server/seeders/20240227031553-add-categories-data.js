"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    return queryInterface.bulkInsert("categories", [
      {
        name: "Electronics",
        nameId: "Elektronik",
        pictureUrl:
          "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709005037/static_resources/gv8ofuleo27pcmc9n8xd.jpg",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Jewerly",
        nameId: "Perhiasan",
        pictureUrl:
          "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709005039/static_resources/h7ehsjq4kev4ruxrmcab.jpg",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Hobbies",
        nameId: "Hobi",
        pictureUrl:
          "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709005041/static_resources/y4rkrry1aktxuzokdck6.png",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Other",
        nameId: "Lainnya",
        pictureUrl:
          "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709005038/static_resources/ttzsoa1ed76gilvewhfq.jpg",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
