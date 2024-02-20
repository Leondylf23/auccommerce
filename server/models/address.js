'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  address.init({
    userId: DataTypes.INTEGER,
    addressLabel: DataTypes.STRING,
    address: DataTypes.TEXT,
    phone: DataTypes.STRING,
    picName: DataTypes.STRING,
    addressNote: DataTypes.TEXT,
    postalCode: DataTypes.STRING,
    mapLat: DataTypes.STRING,
    mapLong: DataTypes.STRING,
    isDefault: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};