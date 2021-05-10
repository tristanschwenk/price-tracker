const {
  Schema,
  model,
  ObjectId
} = require('mongoose');

const FavoriteSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    autopopulate: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

FavoriteSchema.plugin(require('mongoose-autopopulate'));

module.exports = new model('Favorite', FavoriteSchema);

