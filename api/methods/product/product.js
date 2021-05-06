const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');

module.exports = new Method({
  schema: {
    id: String
  },
  execute: async ({data, models}) => {
   const { id } = data;

   return await models.Product.findById(id) || APIError.notFound;
  }
});

