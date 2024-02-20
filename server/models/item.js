'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  item.init({
    storeId: DataTypes.INTEGER,
    itemName: DataTypes.STRING,
    itemPictures: DataTypes.JSON,
    itemDescription: DataTypes.TEXT,
    itemPhysicalSpec: DataTypes.JSON,
    itemStartBidPrice: DataTypes.DECIMAL,
    itemDeadlineBid: DataTypes.DATE,
    itemDirectPrice: DataTypes.DECIMAL,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};