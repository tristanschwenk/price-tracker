const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const {isAuthentificated} = require('../../utils/rules');

module.exports = new Method({
  rules: [
    isAuthentificated,
  ],
  execute: async ({models, auth, data, logger}) => {
    const { fetchProduct } = data;
    let user;

    if(fetchProduct) user = await models.User.findById(auth.payload.userId).populate('products');
    else user = await models.User.findById(auth.payload.userId);

    user.password = undefined;
    return user;
  }
});

