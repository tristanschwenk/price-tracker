const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const {isAuthentificated} = require('../../utils/rules');

module.exports = new Method({
  rules: [
    isAuthentificated,
  ],
  execute: async ({models}) => {
   return await models.Product.find({});
  }
});

