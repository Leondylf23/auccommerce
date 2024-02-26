'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chatDetail.init({
    chatHeaderId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'chatDetail',
  });
  return chatDetail;
};