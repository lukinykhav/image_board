var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Board = new Schema({
    name: {	type: String, unique: true },
    description: String,
    user_id: String
});

module.exports = mongoose.model('Board', Board);