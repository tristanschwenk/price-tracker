const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');

module.exports = new Method({
  schema: {
    refreshToken: String,
  },
  execute: async ({ data, models, services }) => {
    const { refreshToken } = data;

    const payload = services.auth.verifyRefreshJWT(refreshToken);

    if (!payload) {
      return new APIError('No payload');
    }

    const user = await models.User.findOne({
      refreshToken,
    });

    if (!user || payload.userId !== user.id) throw APIError.auth.accountNotFound;

    const tokens = await services.auth.generateTokens({ userId: user.id });

    const res = {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        ...user.toObject(),
        password: undefined,
        refreshToken: undefined,
      },
      ...tokens.payload,
    };

    user.refreshToken = tokens.refreshToken;
    user.lastLoginAt = new Date().toISOString();
    user.save();

    return res;
  },
});
