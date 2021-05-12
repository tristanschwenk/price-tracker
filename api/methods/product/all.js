const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const {isAuthentificated} = require('../../utils/rules');

module.exports = new Method({
  rules: [
    isAuthentificated,
  ],
  execute: async ({models, auth}) => {
   const user = await models.User.findById(auth.payload.userId).populate('products');

   return user.products;
  }
});

