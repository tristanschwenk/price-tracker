const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: String,
  name: String,
  password: String,
  avatar: String,
  lastLoginAt: Date,
  refreshToken: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = new model('User', UserSchema);
