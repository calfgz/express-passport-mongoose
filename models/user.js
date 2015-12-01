/**
 * Created by pc on 2015/11/27.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username : {type: String, required: true},
    password : {type: String, required: true},
    regDate : {type: Date, default: Date.now},
    loginDate : {type: Date, default: Date.now}
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
