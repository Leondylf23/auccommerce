"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.user, {
        foreignKey: "createdBy",
        onDelete: "CASCADE",
      });
    }
  }
  order.init(
    {
      productId: DataTypes.INTEGER,
      transactionCode: DataTypes.STRING,
      status: DataTypes.ENUM("WAITING", "FAILED", "SUCCESS"),
      paymentMethod: DataTypes.ENUM("CASH", "TRANSFER"),
      totalPayment: DataTypes.DECIMAL(10, 2),
      phone: DataTypes.STRING(20),
      address: DataTypes.TEXT,
      businessUserId: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
