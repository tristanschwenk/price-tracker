/* eslint-disable class-methods-use-this */
const {
  compare,
  hash,
} = require('bcryptjs');
const {
  sign,
  verify,
  decode,
} = require('jsonwebtoken');

const Service = require('./service');

require('dotenv').config();

const JWT_ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? '',
  JWT_REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? '',
  JWT_REFRESH_CONFIG = {
    issuer: process.env.ACCESS_TOKEN_SECRET_ISSUER ?? 'price-tracker-api',
  },
  JWT_CONFIG = {
    issuer: process.env.ACCESS_TOKEN_SECRET_ISSUER ?? 'price-tracker-api',
    expiresIn: '6h',
  };

class AuthService extends Service {
  constructor() {
    super();
    this.serviceName = 'Auth Service';
  }

  async hashPassword(password) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }

  async comparePassword(...args) {
    const result = await compare(...args);
    return result;
  }

  signJWT(data) {
    return sign(data, JWT_ACCESS_TOKEN_SECRET, JWT_CONFIG);
  }

  signRefreshJWT(data) {
    return sign(data, JWT_REFRESH_TOKEN_SECRET, JWT_REFRESH_CONFIG);
  }

  generateTokens(data) {
    const accessToken = this.signJWT(data);
    const refreshToken = this.signRefreshJWT(data);
    const payload = decode(accessToken);
    return {
      accessToken,
      refreshToken,
      payload,
    };
  }

  verifyJWT(token) {
    return verify(token, JWT_ACCESS_TOKEN_SECRET);
  }

  verifyRefreshJWT(token) {
    return verify(token, JWT_REFRESH_TOKEN_SECRET);
  }

  authMiddleware(req, res, next) {
    let auth = {
			token: undefined,
			payload: {},
			isTokenValid: false,
		};
    
		const bearerHeader = req.headers['authorization'];
		if (bearerHeader) {
			const bearer = bearerHeader.split(' ');
			if(bearer[0] == 'Bearer') {
				auth.token = bearer[1];

				try {
					const payload = this.verifyJWT(auth.token);
					if(payload && typeof payload.userId === 'string'){
						auth = {
							...auth,
							payload,
							isTokenValid: true,
						}
					}
				} catch (error) {
					if(!['TokenExpiredError', 'NotBeforeError', 'JsonWebTokenError'].includes(error.constructor.name)) {
						this.logger('JWT Middleware', error);
					}
				}
			}
		}

    return auth;
  }
}

module.exports = new AuthService();
