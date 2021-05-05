const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: String,
  name: String,
  password: String,
  avatar: String
});

module.exports = new model('User', UserSchema);