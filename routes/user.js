var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
//var basicAuth = require('basic-auth');
var jwt    = require('jsonwebtoken');

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

    //console.log(req.get('authorization'));
    ////var authHeader = req.headers.authorization;
    ////
    ////// Check to see if the header exists
    ////// If not, return the challenge header and code
    ////if (authHeader === undefined) {
    ////    res.header('WWW-Authenticate', 'Basic realm="Please sign in, yo!"');
    ////    res.status(401).end();
    ////    return;
    ////}


    Account.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) console.log('err!');

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {
            // check if password matches
            console.log(user);
            if ('123' != req.body.password) { // '123' => user.password
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, req.body.username, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });
                user.token = token;

                res.setHeader('Authorization', 'Basic "'+ token + '"');
                //return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }
    });
};

exports.profile = function(req, res) {
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