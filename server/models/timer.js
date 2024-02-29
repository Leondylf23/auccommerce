'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  timer.init({
    dateActivate: DataTypes.DATE,
    type: DataTypes.BOOLEAN,
    dataId: DataTypes.INTEGER,
    activateValue: DataTypes.JSON,
    isActive: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'timer',
  });
  return timer;
};