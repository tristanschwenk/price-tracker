const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const {isAuthentificated} = require('../../utils/rules');

module.exports = new Method({
  schema: {
    url: String
  },
  rules: [
    isAuthentificated,
  ],
  execute: async ({
    data,
    services,
    logger,
    models,
    auth
  }) => {
    const {
      url
    } = data;

    const {asin, name, price, timestamp, image} = await services.amazon.scanProduct(url);


    let product = await models.Product.findOne({
      asin
    });

    if (!product) {

      product = await models.Product.create({
        asin,
        name,
        url,
        image,
        prices: [{
          timestamp,
          value: price
        }]
      });

    }else{

      product = await models.Product.findByIdAndUpdate(product.id, {
        name, 
        image,
        $push: {
          prices: {
            timestamp,
            value: price,
          }
        }
      });
      
    }

    // link the product to the current user
    await models.User.findByIdAndUpdate(auth.payload.userId, {
      $addToSet: {
        products: product._id
      }
    });

    return product;
  }
});