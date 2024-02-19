"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: "createdBy",
        onDelete: "CASCADE",
      });

      this.hasMany(models.order, {
        foreignKey: "productId",
      });
    }
  }
  product.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      description: DataTypes.TEXT,
      imageUrl: DataTypes.TEXT,
      createdBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
