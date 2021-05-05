const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  url: String,
  name: String,
  asin: String,
  prices: [{
    timestamp: Number,
    value: String,
  }],
});

module.exports = new model('Product', ProductSchema);