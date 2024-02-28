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
      this.hasMany(models.bid, {
        foreignKey: "itemId",
      });

      this.hasMany(models.transaction, {
        foreignKey: "itemId",
      });
    }
  }
  item.init({
    userId: DataTypes.INTEGER,
    itemName: DataTypes.STRING,
    itemPictures: DataTypes.JSON,
    itemDescription: DataTypes.TEXT,
    itemPhysicalSpec: DataTypes.JSON,
    itemStartBidPrice: DataTypes.DECIMAL,
    itemDeadlineBid: DataTypes.DATE,
    itemStartBidDate: DataTypes.DATE,
    status: DataTypes.ENUM('DEACTIVATED','ACTIVED','LIVE'),
    category: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};