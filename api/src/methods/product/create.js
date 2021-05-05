const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const rules = require('../../utils/rules');

module.exports = new Method({
  schema: {
    url: String
  },
  execute: async ({
    data,
    services,
    logger,
    models,
  }) => {
    const {
      url
    } = data;

    const {asin, name, price, timestamp} = await services.amazon.scanProduct(url);


    const product = await models.Product.findOne({
      asin
    });

    if (!product) {

      return await models.Product.create({
        asin,
        name,
        url,
        prices: [{
          timestamp,
          value: price
        }]
      });

    }else{

      product.prices.push({
        timestamp: Date.now(),
        value: price,
      });

      return await product.save();
    }

  }
});