const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');

module.exports = new Method({
  schema: {
    email: String,
    password: String,
  },
  execute: async ({ data, models, services }) => {
    const { email, password } = data;

    const user = await models.User.findOne({
      email,
    });
    if (!user) throw APIError.auth.accountNotFound;

    const passwordValid = await services.auth.comparePassword(password, user.password);
    if (!passwordValid) {
      throw APIError.auth.accountNotFound;
    }

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
