var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var jwt    = require('jsonwebtoken');

exports.signUp = function(req, res, callback) {
    //var a = Account.findAllUsers();
    var role = 'user';
    //if(!Account.findAllUsers()) {
    //    role = 'admin';
    //}
    Account.register(new Account({
    username : req.body.username,
    email: req.body.email,
    }), req.body.password,  function(err, account) {
        if (err) {
          return res.send('err');
        }
        //passport.authenticate('local')(req, res, function () {
        //    res.send('success');
        //});
    });
};

exports.signIn = function(req, res) {
    var token = jwt.sign(req.user.name, Date.now() + '', {
        expiresIn: 6840 // expires in 24 hours
    });
    Account.findOneAndUpdate({username: req.body.username}, {token: token}, function(err, user) {
        if(err){
            console.log("Something wrong when updating data!");
        }
        res.send(token);
    });
};

exports.profile = function(req, res) {
    Account.findOne({token: req.headers.authorization}, function(err, docs) {
        res.send(docs);
    });
};

exports.editProfile = function(req, res){
  Account.findOneAndUpdate({ token: req.headers.authorization },
      {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        image: req.file.path,
        description: req.body.description
      }, function(err, docs) {
        res.json(docs);
      });
};