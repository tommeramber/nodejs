const Product = require('../models/product');
const Cart = require('../models/cart');

// !!!!!!!!!!!!! Middleware functions !!!!!!!!!!!!!

exports.getProducts = (req, res, next) => {
    // relative to app.js
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/product'
        });
    });
}

exports.getSepcificProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product: ' + product.title,
            path: '/products'
        });
    });
}

exports.getIndex = (req, res, next) => {
    // relative to app.js
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};