var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    email: String,
    name: String,
    image: String,
    description: String,
    token: String,
    role: String,
    password: String
});

exports.findAllUsers = function() {
    Account.find({}, function(err, users){
        console.log(users);
        return users;
    });

};


Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);