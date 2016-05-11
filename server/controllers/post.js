var express = require('express');
var Account = require('../models/account.js');
var Board = require('../models/board.js');
var Post = require('../models/post.js');

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
    Post.findOne({_id: req.params.id.substring(1)}, function (err, post) {
        if (err) {
            res.send('err');
        }
        else {
            post.remove();
            res.json({ message: 'Successfully deleted' });
        }
    })
};

exports.editPost = function (req, res) {
    Post.findOne({_id: req.params.id.substring(1)}, function (err, post) {
        if (req.file) {
            post.file = req.file.filename;
            post.type_file = req.file.mimetype;
        }
        if(req.body.caption) {
            post.caption = req.body.caption;
        }
        post.save();
        res.json(post);
    })
};

exports.liking = function (req, res) {
  var token = req.headers.authorization.split(' ')[1];

    Account.findOne({token:token}, function (err, user) {
      if (err) {
           res.send('err');
      }
      else {
        Post.findOne({_id: req.params.id.substring(1)}, function (err, post) {
          var search_user_id, post_liking_true, post_liking_false;
          if (req.body.liking) {
            search_user_id = post.user_like.indexOf(user._id);
            post_liking_true = post.user_like;
            post_liking_false = post.user_dislike;
          }
          else {
            search_user_id = post.user_dislike.indexOf(user._id);
            post_liking_true = post.user_dislike;
            post_liking_false = post.user_like;
          }
          if (search_user_id >= 0) { 
            post_liking_true.splice(search_user_id, 1);
            // post_liking_false.push(user._id);
       
          }
          else {
            post_liking_true.push(user._id);
            post_liking_false.splice(search_user_id, 1);
          }
          post.save();
          res.send(post);
        })
      }
    });  
};
