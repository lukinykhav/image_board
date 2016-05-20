var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    file: String,
    type_file: String,
    caption: String,
    board_id: String,
    user_id: String,
    data_created: Date,
    post_id: String,
    user_like: Array,
    user_dislike: Array
});

Post.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    //Vouchers.remove({user_id: this._id}).exec();
    var id = this._id;
    mongoose.model("Post").findOne({post_id: id}, function(err, post) {
        var post_json = JSON.stringify(post);
        Post.remove({_id: post_json._id});
        console.log("pre test", id);
        next();
    });
    //Post.find({post_id: this._id}), function(err, posts) {
    //    console.log(posts);
    //    //posts.remove();
    //});
    next();

});

module.exports = mongoose.model('Post', Post);

