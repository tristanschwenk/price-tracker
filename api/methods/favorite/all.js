const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');
const {isAuthentificated} = require('../../utils/rules');

module.exports = new Method({
  rules: [
    isAuthentificated,
  ],
  execute: async ({models, auth, data, logger}) => {
    const favs = await models.Favorite.find({
      user: auth.payload.userId
    });
    return favs.map(({product})=>product);
  }
});

