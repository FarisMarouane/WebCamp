var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: 'Moutain creed',
    image: 'https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },

  {
    name: 'Bordeaux',
    image: 'https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },

  {
    name: 'River camp',
    image: 'https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
];

var dataBis = {
  content: 'Indeed, a great place that I recommand to everyone ',
  author: 'Homer'
};

function seedDB () {
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Campgrounds removed from db');
      data.forEach(function (camp) {
        Campground.create(camp, function (err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log('Campground created');
                        // Create commment
            Comment.create({
              content: 'Indeed a great that I recommand !',
              author: 'Homer'
            }, function (err, comment) {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log('New comment added');
              }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
