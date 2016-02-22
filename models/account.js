var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    email: String,
    name: String,
    image: String,
    description: String,
    password: String,
    token: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);