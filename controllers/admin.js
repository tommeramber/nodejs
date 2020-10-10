const Product = require('../models/product');

// !!!!!!!!!!!!! Middleware functions !!!!!!!!!!!!!

/* 
    both the add-product and edit-product paegs has the same html, but one is empty (add new product entirly)]
    and the other has the input fields already filled because the product already exist
    if you press "edit" on some product you will be redirected to another route function, not to here
    router.post('/add-product
*/
exports.getAddProductPage = (req, res, next) => {
    // relative to app.js
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postNewProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

//router.get('/edit-product/:productId' 
exports.getEditProductPage = (req, res, next) => {
    /* 
        req.query ==> data passed to the server from client in the URL!!
        .edit ==> http://mysite/admin/edit-product/<productId>?edit=<data that i want to check>
        typeof(<data that i want to check>) == string (always), so use casting accordingly 
        req.query information is optional, so we dont need to find it in the route, but we do need to check its existance here
    */
    const editMode = req.query.edit;
    // editMode == empty (client side didnt pass that key-value pair in the URL)
    if (!editMode) {
        res.redirect('/');
    }

    // in route ==> /edit-product/:productId
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        if (!product) {
            return res.redirect('/');
        }
        // relative to app.js
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            // nothing is going to be highlighted in the nav bar 
            path: '/admin/edit-product',
            // editmode == "true"/"false" (string)
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (res, req, next) => {

};

exports.getProducts = (req, res, next) => {
    // relative to app.js
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
}