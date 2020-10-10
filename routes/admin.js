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

module.exports = router;
