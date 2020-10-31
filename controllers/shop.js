const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
};

// Option 1: (findByPk (PrimaryKey) - file:///D:/Downloads/finished/Sonarr%20TV%20Shows/[FreeTutorials.Eu]%20Udemy%20-%20nodejs-the-complete-guide/11%20Understanding%20Sequelize/151%20MUST%20READ%20findById()%20in%20Sequelize%205.html)
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Option 2: (findAll + sequlize query) ==> findall returns an array so we need the first element only
/*
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findall({ where: { id: prodId } })
    .then(products => {
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: product[0].title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};
*/

exports.getCart = (req, res, next) => {
  // made automaticly by sequlize associations
  req.user.getCart()
    .then(cart => {
      console.log(cart);
      // made automaticly by sequlize associations
      return cart.getProducts();
    })
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postProductToCart = (req, res, next) => {
  const prodId = req.body.productId;
  // we want the cart and the newQuantity objects to be available in the entire then-catch sequence, so we need to declere them in the most upper function
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    // getProducts always return an array, even if it only has 1 element (like in our case, because id is unique)
    .then(products => {
      let product;
      // product does exist in cart - increase its quantity by 1
      if (products.length > 0) {
        product = products[0];
        // sequlize enables us to access data which is in the 'in-between' table, because we used many-to-many association
        // many-to-many <=> products & cart <=> is mabe by 'in-between' table <=> cartItem (hold quantity for each product we have in our specific cart)
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      // product does not exist in cart yet - add it with quantity of 1
      else {
        // we dont have the product in our cart so we need to fetch it from the "products" table seperatly using another promise method
        return Product.findByPk(prodId)
      }
    })
    // handels both cases - from previous "then" function = case #1: we already have the item in cart, case #2: we dont have it in cart
    // in both cases above we return a product object, and update the cart with the new quantity (either 1 or the previousQty+1)
    .then(product => {
      // sequelize associations auto-created function
      // through ==> sequelize many-to-many assosciation. it tells sequelize to look in 3 tables : Products, Carts, and CartItem (we used that "through" in the app.js as an "in-between" table)
      // using through we can specificy what additional information to add to that "in-between" table
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};











/* before sequlize
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    // rows == the actuall data from the table (the products entries)
    // in "getIndex" i fetched two elements from the returned value of the query, but the second one is unecessery - so i pull only whats relevant here
    // the name of the fetched field is up to you, it's the callback returned value
    // two different arrays, we use "next-gen" js syntax to get them seperatly when the query callback finishes
    .then(([products]) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};
*/

/* before sequlize
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    // rows == the actuall data from the table (the products entries)
    // two different arrays, we use "next-gen" js syntax to get them seperatly when the query callback finishes
    .then(([rows, metadata]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};
*/

/* before sequlize
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product[0].title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};
*/

/* before sequlize
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
}; */

/* before sequlize
exports.postProductToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};
*/