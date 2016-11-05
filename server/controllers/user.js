var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var Account = require('../models/account.js');

exports.signUp = function (req, res) {
    Account.find({}, function (err, users) {
        var role = 'user';
        if (!users.length) {
            role = 'admin';
        }
        Account.register(new Account({
            username: req.body.username,
            email: req.body.email,
            role: role
        }), req.body.password, function (err, account) {
            if (err) {
                return res.status(401).json({status: 401});
            }
            return res.status(200).send(account);
        });
    });
};

exports.signIn = function (req, res, next) {
    var token = jwt.sign(req.body.username, Date.now() + '', {
        expiresIn: 86400 // expires in 24 hours
    });
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            Account.findOneAndUpdate({username: req.body.username}, {token: token}, function (err, user) {
                if (err) {
                    res.status(304).json({error: err});
                }
                res.status(200).json({
                    token: token
                });
            });
        });
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
};

exports.profile = function (req, res) {
    if(req.user.token) {
        Account.findOne({token: req.user.token}, function (err, user) {
            if (err) {
                res.send(err);
            }
            else {
                res.json(user);
            }
        });
    }
    else {
        res.status(304).json('No token');
    }

};

exports.editProfile = function (req, res) {
    Account.findOneAndUpdate({token: req.user.token},
        {
            name: req.body.name,
            email: req.body.email,
            description: req.body.description
        }, function (err, user) {
            res.json(user);
        });
};

exports.loadAvatar = function (req, res) {
    console.log(req.user.token);
    Account.findOneAndUpdate({token: req.user.token},
        {
            image: req.file.filename
        }, function (err, user) {
            res.json(user)
        });
};

exports.getStatus = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json(false);
    }
    return res.status(200).json(true);
};

//could test
exports.userRole = function (req, res) {
    Account.findOne({token: token}, function (err, user) {
        res.send(user.role);
    })
};

exports.getUserInfo = function (token, params, callback) {
    Account.findOne({token: token}, function (err, user) {
        var arr = [];
        if (!err) {
            for (var i = 0; i < params.length; i++) {
                arr.push(user[params[i]]);
            }
        }
        callback(arr);
    })
};

exports.assignRole = function (req, res) {
    Account.findOne({username: req.body.username}, function (err, user) {
        if (user.role == 'user') {
            user.role = 'admin';
        }
        else {
            user.role = 'user';
        }
        user.save(function (err) {
            if (err) {
                console.error('ERROR!');
            }
        });
        res.json(user);

    });
};
