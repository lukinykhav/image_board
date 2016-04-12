var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    content: String,
    caption: String,
    board_name: String,
    user_id: String,
    data_created: Date,
    post_id: String
});

module.exports = mongoose.model('Post', Post);