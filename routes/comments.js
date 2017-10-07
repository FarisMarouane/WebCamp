var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var isLoggedIn = require('../middleware/isLoggedIn');
var checkCommentOwnership = require('../middleware/checkCommentOwnership');

// Comment form route
router.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// post new comment route
router.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log('error finding the camp');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log('error creating the comment');
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + req.params.id);
        }
      });
    }
  });
});

// Edit comment form route
router.get('/campgrounds/:id/comments/:comment_id/edit', checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect('back');
      console.log(err);
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// Edit comment logic
router.put('/campgrounds/:id/comments/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Delete comment route
router.delete('/campgrounds/:id/comments/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentOwnership (req, res, next){
//     if(req.isAuthenticated()){
//             Comment.findById(req.params.comment_id, function(err, foundComment){
//                 if(err){
//                     res.redirect("back");
//                 } else {
//                     if(foundComment.author.id.equals(req.user._id)){
//                         next();
//                     } else {
//                         res.send("You do not have permission");
//                     }
//                 }
//                 });
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = router;
