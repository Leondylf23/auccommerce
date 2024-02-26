'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatHeader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chatHeader.init({
    userIdOrigin: DataTypes.INTEGER,
    userIdDest: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,    modelName: 'chatHeader',
  });
  return chatHeader;
};