'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  store.init({
    userId: DataTypes.INTEGER,
    storeRequestId: DataTypes.INTEGER,
    storeName: DataTypes.STRING,
    storePicture: DataTypes.TEXT,
    storeAddress: DataTypes.TEXT,
    storePostalCode: DataTypes.STRING,
    storeMap: DataTypes.JSON,
    storeDescription: DataTypes.TEXT,
    transactionCount: DataTypes.BIGINT,
    responsePercentage: DataTypes.DECIMAL,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'store',
  });
  return store;
};