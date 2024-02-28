'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaction, {
        foreignKey: "bidId",
      });

      this.belongsTo(models.item, {
        foreignKey: "itemId",
        onDelete: "CASCADE"
      });

      this.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE"
      });
    }
  }
  bid.init({
    userId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    bidPlacePrice: DataTypes.DECIMAL,
    status: DataTypes.ENUM('PLACED', 'WAITING','FAILED','WAIT_PAYMENT', 'WAIT_CONFIRM', 'PROCESSING', 'SHIPPING', 'COMPLETED'),
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'bid',
  });
  return bid;
};