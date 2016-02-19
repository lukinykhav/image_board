var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var multer  = require('multer');
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
  }
});
var upload = multer({ storage: storage });

router.get('/', function (req, res) {
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
  res.render('register', { });
});

router.post('/register', function(req, res) {
  Account.register(new Account({
    username : req.body.username,
    email: req.body.email
  }), req.body.password,  function(err, account) {
    if (err) {
      return res.render('register', { account : account });
    }

    passport.authenticate('local')(req, res, function () {
      req.session.username = req.body.username;
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  req.session.username = req.body.username;
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});

router.get('/profile', function(req, res){
  res.render('profile', { });
});


// when don't enter value in input save null
router.post('/profile', upload.single('image'), function(req, res){
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
});

module.exports = router;