const {
  Schema,
  model
} = require('mongoose');

const ProductSchema = new Schema({
  url: String,
  name: String,
  asin: String,
  image: String,
  prices: [{
    timestamp: Number,
    value: Number,
  }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ProductSchema.virtual('priceDiff').get(function (){
  const firstPrice = this.prices[0].value;
  const lastPrice = this.prices[this.prices.length - 1].value;

  return firstPrice-lastPrice;
})

module.exports = new model('Product', ProductSchema);