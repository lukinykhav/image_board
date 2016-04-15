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
           post.file = req.file.filename;
           post.caption = req.body.caption;
           post.board_id = req.body.board_id;
           post.user_id = user._id;
           post.data_create = Date.now();

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
    var board_name = req.params.name.substring(1);
    Post.find({board_name: board_name}, function (err, posts) {
        if(err) {
            res.send('err')
        }
        else {
            res.send(posts);
        }
    });
    // var token = req.headers.authorization.split(' ')[1];
};