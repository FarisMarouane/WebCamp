var express = require('express');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');
// var seedDB=require("./seed");
var methodOverride = require('method-override');
var flash = require('connect-flash');

// console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://marouane:warrios@ds115493.mlab.com:15493/yelpcamp");

// seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

    // campground model definition and declaration
var User = require('./models/user');

// Passport configuration
app.use(require('express-session')({
  secret: 'Marouane',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// makes sure they are defined on all routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Requiring routes
var campgroundsRoute = require('./routes/campgrounds');
var commentsRoute = require('./routes/comments');
var authRoute = require('./routes/auth');

// =======================
// Routes
// =======================
app.use(campgroundsRoute);
app.use(commentsRoute);
app.use(authRoute);

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Yelp server has started');
});
