var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var jwt    = require('jsonwebtoken');

exports.signUp = function(req, res) {
    Account.find({}, function(err, users) {
        var role = 'user';
        if(err) console.log('error');
        if(!users.length) {
            role = 'admin';
        }
        Account.register(new Account({
            username : req.body.username,
            email: req.body.email,
            role: role
            }), req.body.password,  function(err, account) {
                if (err) {
                  return res.send('err');
                }
                res.send(account);
        });
    });
};

exports.signIn = function(req, res) {
    var token = jwt.sign(req.body.username, Date.now() + '', {
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
      }, function(err, user) {
        res.json(user);
      });
};

exports.getAllUsers = function(req, res) {
    Account.findOne({token: req.headers.authorization}, function(err, docs) {
        Account.find({}, function(err, users) {
            res.json(users);
        });
    });
};

exports.assignRole = function(req, res) {
    Account.findOne({username: req.body.username}, function(err, user) {
        if(user.role == 'user') {
            user.role = 'admin';
        }
        else {
            user.role = 'user';
        }
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
        res.json(user);

    });
};