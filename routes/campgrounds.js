var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var isLoggedIn = require('../middleware/isLoggedIn');
var checkCampgroundOwnership = require('../middleware/checkCampgroundOwnership');

router.get('/campgrounds', function (req, res) {
  Campground.find({}, function (err, Allcampgrounds) {
    if (err) {
      console.log('sommeting went wrong');
      console.log(err);
    } else {
      res.render('campgrounds/campgrounds', {campgrounds: Allcampgrounds, currentUser: req.user});
    }
  });
});

// new campground route
router.post('/campgrounds', isLoggedIn, function (req, res) {
  var name = req.body.name;
  var url = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  console.log(req.body);
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCamp = {name: name, price: price, image: url, description: desc, author: author};

  Campground.create(newCamp, function (err, camp) {
    if (err) {
      console.log(err);
      console.log('Something went wrong');
    } else {
      console.log('A new campground has been added to the DB: ');
    }
  });

  req.flash('success', 'You have successfully added a new campground');
  res.redirect('campgrounds/');
});

router.get('/campgrounds/new', isLoggedIn, function (req, res) {
  res.render('campgrounds/new');
});

// show route
router.get('/campgrounds/:id', function (req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log('error!');
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// Edit campground form
router.get('/campgrounds/:id/edit', checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', {campground: foundCampground});
  });
});

// Update campground logic
router.put('/campgrounds/:id', checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      req.flash('success', "You successfully edited the campground's info");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Delete a campground logic
router.delete('/campgrounds/:id', checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log('failed to remove camp from db');
      console.log(err);
    }
    req.flash('success', 'You successfully deleted the campground');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
