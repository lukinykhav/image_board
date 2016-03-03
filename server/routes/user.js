// var express = require('express');
// var passport = require('passport');
// var Account = require('../models/account');
// var jwt    = require('jsonwebtoken');
//
// exports.signUp = function(req, res) {
//     Account.find({}, function(err, users) {
//         var role = 'user';
//         if(err) console.log('error');
//         if(!users.length) {
//             role = 'admin';
//         }
//         Account.register(new Account({
//             username : req.body.username,
//             email: req.body.email,
//             role: role
//             }), req.body.password,  function(err, account) {
//                 if (err) {
//                   return res.send('err');
//                 }
//                 res.send(account);
//         });
//     });
// };
//
// exports.signIn = function(req, res) {
//     var token = jwt.sign(req.body.username, Date.now() + '', {
//         expiresIn: 6840 // expires in 24 hours
//     });
//     Account.findOneAndUpdate({username: req.body.username}, {token: token}, function(err, user) {
//         if(err){
//             console.log("Something wrong when updating data!");
//             return res.send(err);
//         }
//         res.send(token);
//     });
// };
//
// exports.profile = function(req, res) {
//     Account.findOne({token: req.headers.authorization}, function(err, docs) {
//         res.send(docs);
//     });
// };
//
// exports.editProfile = function(req, res){
//   Account.findOneAndUpdate({ token: req.headers.authorization },
//       {
//         username: req.body.username,
//         email: req.body.email,
//         name: req.body.name,
//         image: req.file.path,
//         description: req.body.description
//       }, function(err, user) {
//         res.json(user);
//       });
// };
//
// exports.getAllUsers = function(req, res) {
//     Account.findOne({token: req.headers.authorization}, function(err, docs) {
//         Account.find({}, function(err, users) {
//             res.json(users);
//         });
//     });
// };
//
// exports.assignRole = function(req, res) {
//     Account.findOne({username: req.body.username}, function(err, user) {
//         if(user.role == 'user') {
//             user.role = 'admin';
//         }
//         else {
//             user.role = 'user';
//         }
//         user.save(function (err) {
//             if(err) {
//                 console.error('ERROR!');
//             }
//         });
//         res.json(user);
//
//     });
// };



var express = require('express');
var router = express.Router();
var passport = require('passport');

var Account = require('../models/account.js');


router.post('/register', function(req, res) {
  console.log(req.body);
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


  // User.register(new Account({
  //   username : req.body.username,
  //   email: req.body.email,
  //   role: role }),
  //   req.body.password, function(err, account) {
  //   if (err) {
  //     return res.status(500).json({
  //       err: err
  //     });
  //   }
  //   passport.authenticate('local')(req, res, function () {
  //     return res.status(200).json({
  //       status: 'Registration successful!'
  //     });
  //   });
  // });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});


module.exports = router;
