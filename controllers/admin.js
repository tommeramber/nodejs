const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // create is method (promise) that sequelize grants us
  // we pass the json object to it and it automaticly creats the new row in the DB
  // id is getting created automaticly
  Product.create({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
    .then(result => {
      console.log('Product got created');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        editing: editMode,
        pageTitle: 'Edit Product',
        product: product,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/');
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      // it wont update the object in the db automaticly
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;

      // now it'll be updated in the db
      return product.save();
    })
    // this "then" will be called upon the resolve of the product.save promise
    .then(result => {
      console.log('updated product!');
      res.redirect('/admin/products');
    })
    // this "catch" block will catch the errors of all the previous promises in the chain
    .catch(err => {
      console.log(err);
    })
  // originaly the redirect was located here, but because nodejs is async in nature - it rendered the page with the un-updated data, so it required a refresh to the page in order to get the new data from the db and present it.
  // so we nested the redirect in the final callback so it'll be called upon only after the db has been updated
};


exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'All Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("DESTROYED PRODUCT");
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    })
};


/* before sequelize
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save()
    .then(() => { res.redirect('/'); })
    .catch(err => {
      console.log(err);
    });
};
*/

/* before sequelize
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
*/

/* before sequelize
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};
*/

/* before sequlize
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
}; */