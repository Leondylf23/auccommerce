'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class itemDiscussionReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  itemDiscussionReply.init({
    itemDiscussionId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'itemDiscussionReply',
  });
  return itemDiscussionReply;
};