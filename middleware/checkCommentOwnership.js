var Comment = require('../models/comment');

module.exports = function checkCommentOwnership (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
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
