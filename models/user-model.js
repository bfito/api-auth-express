const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  encryptedPassword: String,
  nickname: String
}, {
  timestamps:true
});

const User = mongoose.model('User', uscerSchema);

module.exports = Users;
