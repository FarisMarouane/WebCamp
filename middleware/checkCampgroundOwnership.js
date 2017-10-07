var Campground = require('../models/campground');

module.exports = function checkCampgroundOwnership (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.send('You do not have permission');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};
