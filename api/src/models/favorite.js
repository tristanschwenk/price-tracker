const { Schema, model, ObjectId } = require('mongoose');

const FavoriteSchema = new Schema({
  product: ObjectId,
  user: ObjectId,
});

module.exports = new model('Favorite', FavoriteSchema);
