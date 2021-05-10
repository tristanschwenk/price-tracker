const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const {isAuthentificated} = require('../../utils/rules');

module.exports = new Method({
  schema: {
    product: String
  },
  rules: [
    isAuthentificated,
  ],
  execute: async ({models, auth, data, logger}) => {
    const {product} = data;

    const fav = await models.Favorite.findOneAndDelete({
      user: auth.payload.userId,
      product
    });

    return fav.product;
  }
});

