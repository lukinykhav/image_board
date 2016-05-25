var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var user = require('./controllers/user');
var board = require('./controllers/board');
var post = require('./controllers/post');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(3000);

//delete after test function in user.js
// var multer  = require('multer');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/')
//   },
//   filename: function (req, file, cb) {
//       console.log(file);
//     cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
//   }
// });
// var upload = multer({ storage: storage });

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        console.log(req, file);
        cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
    }
});
var upload = multer({ storage: storage });


// var app = express();

// view engine setup
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../uploads')));

app.use(express.static(path.join(__dirname, '../node_modules')));

// view engine setup
// app.set('views', path.join(__dirname, '../client/partials'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static(path.join(__dirname, 'public')));

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/test');

app.post('/add_post', upload.single('file'), post.addPost);

app.post('/create_board', board.createBoard);
app.get('/list_board', board.listBoard);
app.get('/all_boards', board.allBoards);
app.get('/get_board/:_id', board.getBoard);

app.get('/get_post/:id', post.getPost);
app.post('/get_user_post/:id', post.getUserPost);
app.get('/delete_post/:id', post.deletePost);
app.post('/edit_post/:id', upload.single('file'), post.editPost);
app.post('/like/:id', post.liking);
// app.post('/add_post',  upload.single('content'), post.addPost);


app.use('/', user);

app.use('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


io.on('connection', function (socket) {
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('news', data);
  });
});

// app.use('/', board);



// app.post('/create_board', function(req, res) {
//   console.log(req.body);
//   res.send(req.body.name);
// })

//this comment to see routes (refactoring), delete after test function in user.js
// app.post('/register', user.signUp);
// 
// app.post('/login',  passport.authenticate('local'), user.signIn);
//
// app.get('/profile', user.profile);
//
// app.post('/profile', upload.single('image'), user.editProfile);
//
// app.get('/admin', user.getAllUsers);
//
// app.post('/assign_role', user.assignRole);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.send();
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.send();
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});


module.exports = app;
