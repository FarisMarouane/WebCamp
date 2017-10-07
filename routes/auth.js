var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Root route
router.get('/', function (req, res) {
  res.render('campgrounds/home');
});

// Register form
router.get('/register', function (req, res) {
  res.render('register');
});

// Sign up logic
router.post('/register', function (req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.render('register');
    } else if (req.body.password !== req.body.checkPassword) {
            // Checks if both password typed are the same
      req.flash('error', 'the 2 password must be identitical');
      res.redirect('/register');
      console.log('The 2 password must be identitical');
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,12}$/.test(req.body.password)) {
      req.flash('error', 'Password must be: from 6 to 12 characters, at least one uppercase character and at least one lowercase character');
      res.redirect('/register');
      console.log(req.body.password, req.body.checkPassword);
    } else {
      passport.authenticate('local')(req, res, function () {
        req.flash('success', 'Welcome to YelpCamp' + ' ' + user.username);
        res.redirect('/campgrounds');
      });
    }
  });
});

// Login form
router.get('/login', function (req, res) {
  res.render('login');
});

// Login logic
router.post('/login', passport.authenticate('local', {

  successRedirect: '/campgrounds',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.',
  successFlash: 'Welcome!'

}), function (req, res) {
});

// Logout logic
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You successfully logged out');
  res.redirect('/campgrounds');
});

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
