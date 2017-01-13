var express = require('express');
// var router = express.Router();

var Board = require('../models/board.js');
var Account = require('../models/account.js');
var Post = require('../models/post.js');

// router.post('/create_board', function(req, res) {

//   console.log(req.body);
//   res.send(req.body.name);
// })

// module.exports = router;


exports.createBoard = function(req, res) {
	//var token = req.headers.authorization.split(' ')[1];

	Account.findOne({ token: req.user.token }, function(err, user) {
	    if(err) {
	      res.send('err');
	    }
	    else {
	    	// Find the same name of board
	    	Board.findOne({ name: req.body.name }, function(err, board) {
	    		if (board === null) {
	    			// Create a new instance of the Board model
	    			var board = new Board();

					// Set the board properties that came from the POST data
					board.name = req.body.name;
					board.description = req.body.description;
					board.user_id = user._id;

					// Save the board and check for errors
					board.save(function(err, board) {
						if(err) {
							res.send(err);
						}
						res.json({ message: 'Board added!', data: board });
					});
	    		}
	    		else {
	    			res.send('this name of board exists');
	    		}

	    	});
	    }
	});
};

exports.listBoard = function(req, res) {
	//var token = req.headers.authorization.split(' ')[1];
	
	Account.findOne({token: req.user.token}, function(err, user) {
		console.log(user);
		if(err) {
		    res.send('err');
		}
		else {

			Board.find({user_id: user._id}, function(err, boards) {
				console.log(boards);
				res.send(boards);
			});
		}
	});

};

exports.allBoards = function(req, res) {
	Board.find({}, function(err, boards) {
		res.send(boards);
	})
};

exports.getBoard = function (req, res, next) {
	Board.findOne({_id: req.params._id.substring(1)}, function (err, board) {
		if (board) {
			Post.find({board_id: board._id}, function (err, posts) {
				if (err) {
					res.send(err);
				}
				res.json({
					board: board,
					posts: posts
				})
			})
		}
		else {
			res.status(404).json({
				err: err
			});
			// res.sendStatus(404);
		}
	})
};