var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt    = require('jsonwebtoken');
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
  }
});
var upload = multer({ storage: storage });

var Account = require('../models/account.js');

router.post('/register', function(req, res) {
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
                  passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({
                      status: 'Registration successful!'
                    });
                  });
          });
      });
});

router.post('/login', function(req, res, next) {
  var token = jwt.sign(req.body.username, Date.now() + '', {
      expiresIn: 6840 // expires in 24 hours
  });
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
      Account.findOneAndUpdate({username: req.body.username}, {token: token}, function(err, user) {
        if(err){
          console.log("Something wrong when updating data!");
        }
        res.status(200).json({
          status: 'Login successful!',
          token: token
        });
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

router.get('/profile', function(req, res){
  var token = req.headers.authorization.split(' ')[1];
  Account.findOne({ token: token }, function(err, docs) {
    if(err) {
      res.send('err');
    }
    else {
      res.send(docs);
    }
  });
});

router.post('/profile', upload.single('image'), function(req, res){
  var token = req.headers.authorization.split(' ')[1];
  Account.findOneAndUpdate({ token: token },
      {
        name: req.body.name,
        email: req.body.email,
        description: req.body.description
      }, function(err, user) {
        res.json(user);
      });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

module.exports = router;

//this comment to refactoring code
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
