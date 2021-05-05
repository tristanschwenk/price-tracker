const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');

module.exports = new Method({
  execute: async ({models}) => {
   return await models.Product.find({});
  }
});

