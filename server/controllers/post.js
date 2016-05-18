var express = require('express');
var Account = require('../models/account.js');
var Board = require('../models/board.js');
var Post = require('../models/post.js');
var User = require('../controllers/user.js');

exports.addPost = function (req, res) {
    var token = req.headers.authorization.split(' ')[1];

    Account.findOne({token:token}, function (err, user) {
       if (err) {
           res.send('err');
       }
       else {
           var post = new Post();
           if(req.file) {
               post.file = req.file.filename;
               post.type_file = req.file.mimetype;
           }
           post.caption = req.body.caption;
           post.board_id = req.body.board_id;
           post.user_id = user._id;
           post.data_create = Date.now();
           post.post_id = req.body.post_id;

           post.save(function(err, post) {
               if(err) {
                   res.send(err);
               }
               res.json({ message: 'Post added!', data: post});
           });
       }
    });
};

exports.getPost = function (req, res) {
    var post_id = req.params.id.substring(1);
    Post.find({$or:[{post_id: post_id}, {_id: post_id}]}, function (err, posts) {
        if(err) {
            res.send('err')
        }
        else {
            res.send(posts);
        }
    });
};

exports.deletePost = function (req, res) {
  User.getUserInfo(req.user.token, ['_id', 'role'], function(user_info) {
    Post.findOne({_id: req.params.id.substring(1)}, function (err, post) {
        if (!err) {
          if (user_info[0] == post.user_id || user_info[1] == 'admin') {
            post.remove();
            res.json({ message: 'Successfully deleted' });
          }
          else {
            res.send(403);
          }
        }
    })
  })
};

exports.editPost = function (req, res) {
    User.getUserInfo(req.user.token, ['_id', 'role'], function(user_info) {
      Post.findOne({_id: req.params.id.substring(1)}, function (err, post) {
        if(user_info[0] == post.user_id || user_info[1] == 'admin') {
           if (req.file) {
              post.file = req.file.filename;
              post.type_file = req.file.mimetype;
          }
          if(req.body.caption) {
              post.caption = req.body.caption;
          }
          post.save();
          res.json(post);
        }
        else {
          res.sendStatus(403);
        }
      })
  });
    
};

exports.liking = function (req, res) {
  var token = req.headers.authorization.split(' ')[1];

    Account.findOne({token:token}, function (err, user) {
      if (err) {
           res.send('err');
      }
      else {
        Post.findOne({_id: req.params.id.substring(1)}, function (err, post) {
          var search_like = post.user_like.indexOf(user._id);
          var search_dislike = post.user_dislike.indexOf(user._id);
          if (req.body.liking) {
            if(search_like === -1) {
              post.user_like.push(user._id);
              if (search_dislike > -1) {
                post.user_dislike.splice(search_dislike, 1);
              }
            }
          }
          else {
            if(search_dislike === -1) {
              post.user_dislike.push(user._id);
              if (search_like > -1) {
                post.user_like.splice(search_like, 1);
              }
            }
          }
          post.save();
          res.send(post);
        })
      }
    });  
};
