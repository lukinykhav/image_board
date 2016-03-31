var express = require('express');
var router = express.Router();

var Board = require('../models/board.js');

router.post('/create_board', function(req, res) {
	console.log(1);
})

module.exports = router;