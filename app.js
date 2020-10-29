const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const CartItem = require('./models/cart-item');
const Cart = require('./models/cart');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { userInfo } = require('os');
const { getMaxListeners } = require('process');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// we run it for every new request from any client. 
// currently we are only having a dummy user, and we will "login" once - so we want to attach it to our session somehow, so it'll be accessible in our app
// it'll be deleted later on
// it just register that user in the middleware chain for a later use by the app - it is getting created just once - when we initiating the app for the first time and sequelize sync with DB
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            // we are adding the req env var for that session a new property with the specific user data
            // @ts-ignore
            // we are acutally saving the sequlize object, whichmeans that it has all the methods and properties of any other sequelize object that we can use such as create and destroy, getProduct, getCart (made by association automaticly) etc
            req.user = user;
            next();
        })
        .then((cart) => {

        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);



// ---------------- Sequlize Associations ---------------- 
// onDelete: 'CASCADE' == if we delete the user, every product which is belongs To it will be deleted as well
// many-to-one
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// one-to-many
Cart.belongsTo(User);
User.hasOne(Cart);

// many-to-many
// CartItem is going to be the intermidiate table between the other two ==> CartIDs to ProductIDs
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// many-to-one
CartItem.belongsTo(Cart, { constraints: true, onDelete: 'CASCADE' });
Cart.hasMany(CartItem);



// looks for sequelized objects in your program and creats a table for each of them based on their definitions + relations between them
// force: true ==> will change the association everytime the app will run, not recommended in prod environment (it overwrite the current table structure & existing data). we are only using it because we already created the DB tables in previous exercises. We only running it once and then comment it 
// we are also using the force: true when we add the Cart and CartId models and associations, so the tables needs to be recreated, afterwards we should disable it again
sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        // if i have no user in DB -> create a dummy one
        if (!user) {
            return User.create({ name: 'Max', email: 'test@gmail.com' })
        }
        // we could just return a user, but in order to utilize the then-chain mechanizem of promises, we would like to return a function
        // "user.create" is a function and "promise.resolve(user)" is a function
        // that way we keeping our code consistent
        return Promise.resolve(user);
    })
    // here we definitly are getting a user 
    .then(user => {
        //console.log(user);
        // we create a "dummy" cart for that user so we'll be able to add products into it etc
        return user.createCart();
    })
    .then((cart) => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
