var express = require('express');
var Account = require('../models/account.js');
var Board = require('../models/board.js');
var Post = require('../models/post.js');

exports.addPost = function (req, res) {
    var token = req.headers.authorization.split(' ')[1];
    console.log(req.headers);

    Account.findOne({token:token}, function (err, user) {
       if (err) {
           res.send('err');
       }
       else {
           var post = new Post();
           post.content = req.body.content;
           post.caption = req.body.caption;
           post.board_name = req.body.board_name;
           post.user_id = user._id;

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
    res.send(200);
    // var token = req.headers.authorization.split(' ')[1];
};