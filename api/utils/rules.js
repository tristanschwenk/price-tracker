const { auth } = require("./ApiError")

const isAuthentificated = ({auth}) => {
    return auth.isTokenValid;
  }

module.exports = {
  isAuthentificated
}