const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// we define our "class/object" in the sequelize because we will interact with it via the DB only
// we basicly define how a single instance of a "product-sequelize-object" should look like in the DB as well as in the program

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;


























// before sequelize
/*
const Cart = require('./cart');

const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // db is generated automaticly by the DB engines
    // the "?" is ment to avoid sqlinjection
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {

  }

  // we removed the "cb" because we are using promise to wait the async code to finish executing
  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id=?', [id]);
  }
};
*/