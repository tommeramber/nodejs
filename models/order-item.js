const Sequelize = require('sequelize');
const sequelize = require('../util/database');


// an in-between table that connects between many-orders to many-products, that each user has
const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = OrderItem;