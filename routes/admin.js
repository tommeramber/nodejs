const path = require('path');

const express = require('express');
const adminController = require('../controllers/admin')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProductPage);

// /admin/add-product => POST
router.post('/add-product', adminController.postNewProduct);

// /admin/products => GET (filtering to the /admin path already takes place in app.js)
router.get('/products', adminController.getProducts);

// /admin/edit-product/{productId} => GET (filtering to the /admin path already takes place in app.js)
router.get('/edit-product/:productId', adminController.getEditProductPage);

// /admin/edit-product => POST (filtering to the /admin path already takes place in app.js)
router.post('/edit-product', adminController.postEditProduct);
module.exports = router;
