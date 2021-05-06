const {
  Schema,
  model
} = require('mongoose');

const ProductSchema = new Schema({
  url: String,
  name: String,
  asin: String,
  prices: [{
    timestamp: Number,
    value: String,
  }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ProductSchema.virtual('priceDiff').get(function (){
  const firstPrice = parseFloat(this.prices[0].value.replace(',', '.'));
  const lastPrice = parseFloat(this.prices[this.prices.length - 1].value.replace(',', '.'));

  
  return firstPrice-lastPrice;
})

module.exports = new model('Product', ProductSchema);