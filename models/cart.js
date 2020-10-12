const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        // @ts-ignore
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // no cart file, so there is nothing to delete
      if (err) {
        return;
      }

      // extract existing cart to new array, element by elemenet
      // @ts-ignore
      const updatedCart = { ...JSON.parse(fileContent) }

      // find the desired product we want to delete
      const product = updatedCart.products.find(prod => {
        prod.id === id
      });
      const productQty = product.qty;

      // removes the desired product from our updatedCart
      // filter keeps only the items in the array that returns "true" in the "if" statment ==> every other product but the one we want to delete 
      updatedCart.products = updatedCart.products.filter(product => {
        product.id !== id
      });

      // reduce, from the totalprice of the cart, the desired productPrice by the amount we have from it in the cart (quantity)
      updatedCart.totalPrice = updatedCart.productPrice - productPrice * productQty;

      // write the new array-data to the file
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
};
