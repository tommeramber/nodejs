const fs = require('fs');
const path = require('path');
const myPath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(myPath, (err, fileContent) => {
        let products = [];
        if (!err) {
            // @ts-ignore
            products = JSON.parse(fileContent);
        }
        cb(products);
    });
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        console.log("my new product:\n" + "title: " + title + " image url: " + imageUrl + " description: " + description + " price: " + price)
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(myPath, JSON.stringify(products), (err) => {
                if (err) // err == empty
                    console.log(err);
            });
        });
    };

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}