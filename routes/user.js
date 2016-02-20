var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var basicAuth = require('basic-auth');

exports.signUp = function(req, res) {
  Account.register(new Account({
    username : req.body.username,
    email: req.body.email
  }), req.body.password,  function(err, account) {
    if (err) {
      return res.send('err');
    }

      passport.authenticate('basic', { session: false })(req, res, function () {
      req.session.username = req.body.username;
      res.send('success');
    });
  });
};

exports.signIn = function(req, res) {
    console.log(req);
    req.session.user_id = user_id;
    res.send('success login');
};

exports.profile = function(req, res) {
    console.log(req);
    res.send('123');
    //var user = Account.findById(req.session.user_id);
    //console.log(user);
};

// when don't enter value in input save null
exports.editProfile = function(req, res){
  Account.findOneAndUpdate({ username: req.session.username },
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