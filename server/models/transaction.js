'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    userId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    bidId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    transactionCode: DataTypes.STRING,
    totalPayment: DataTypes.DECIMAL,
    bidPrice: DataTypes.DECIMAL,
    shippingPrice: DataTypes.DECIMAL,
    shippingjson: DataTypes.JSON,
    shippingId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    paymentJson: DataTypes.JSON,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};