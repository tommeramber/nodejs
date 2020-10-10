const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// EJS is supported out-of-the-box just like pug
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error')

// Middleware functions for styling & body parsing engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware functions for routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Middleware function for 404 page controller - there's no interaction with model so no need to route...
app.use(errorController.get404Page);

app.listen(3000);
