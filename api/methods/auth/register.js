const APIError = require('../../utils/ApiError');
const Method = require('../../utils/Method');

module.exports = new Method({
  schema: {
    email: String,
    password: String,
    name: String,
  },
  execute: async ({ data, models, services }) => {
    const { name, email, password } = data;

    const existingUser = await models.User.findOne({
      email,
    });
    if (existingUser) throw APIError.auth.emailAlreadyUsed;

    const hashedPassword = await services.auth.hashPassword(password);

    const user = await models.User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  },
});
