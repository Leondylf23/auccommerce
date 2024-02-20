'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class itemRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  itemRating.init({
    userId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    rate: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'itemRating',
  });
  return itemRating;
};