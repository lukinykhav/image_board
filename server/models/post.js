var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    file: String,
    type_file: String,
    caption: { type: String,  required: true },
    board_id: String,
    user_id: String,
    data_created: Date,
    post_id: String,
    children: String,
    user_like: Array,
    user_dislike: Array
});

Post.pre('remove', function(next) {
    var id = this._id;
    this.model("Post").find({post_id: id}, function(err, posts) {
        for (var i = 0; i < posts.length; i++) {
            posts[i].remove();
        }
        next();
    });
    next();

});

module.exports = mongoose.model('Post', Post);

