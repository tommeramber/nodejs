const fs = require('fs');
const path = require('path');
const myPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

/*
    For a specific session there will always will be just a single cart
    Therefor, we wont add a constructor - we will use static functions only - a semi-Singleton
*/

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch previous cart's data
        fs.readFile(myPath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) { // Not an Empty File
                // @ts-ignore
                cart = JSON.parse(fileContent);
            }

            // Analyze details on the new product ==> check if it already exists in cart or need to be added compeltely 
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            // Add it to the cart / increase quantity
            if (existingProduct) { // existingProduct != empty
                // copy each proparty seperatly, an updatedProduct will point to an entirly different locaation
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;

                // a newly created array that points to an entirly different location in memory
                // copied item-by-item + changing the existing product quntity
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;

            } else {
                updatedProduct = { id: id, qty: 1 };
                // a newly created array that points to an entirly different location in memory
                // copied item-by-item + adding the new product's details
                cart.products = [...cart.products, updatedProduct];
            }
            // the extra "+" turns the string to number
            cart.totalPrice = cart.totalPrice + +productPrice;

            // write the new cart's data to the same file
            fs.writeFile(myPath, JSON.stringify(cart), (err) => {
                console.log("error writing updated cart to file: " + err);
            });
        });
    }
} 