"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.bid, {
        foreignKey: "userId",
      });

      this.hasMany(models.transaction, {
        foreignKey: "userId",
      });
    }
  }
  user.init(
    {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      pictureUrl: DataTypes.TEXT,
      dob: DataTypes.DATE,
      role: DataTypes.STRING(10),
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
