'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class storeRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  storeRequest.init({
    userId: DataTypes.INTEGER,
    storeName: DataTypes.STRING,
    storePicture: DataTypes.TEXT,
    storeAddress: DataTypes.TEXT,
    storeDescription: DataTypes.TEXT,
    storeMap: DataTypes.JSON,
    storePostalCode: DataTypes.STRING,
    userIdentityJson: DataTypes.JSON,
    status: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'storeRequest',
  });
  return storeRequest;
};