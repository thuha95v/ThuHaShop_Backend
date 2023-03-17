const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Token } = require("../models");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { tokenTypes } = require("../config/token");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const moment = require("moment");
/**
 * Login with account and password
 * @param {string} account
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (account, password) => {
  const user = await userService.getUserByAccount(account);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect username or password"
    );
  }
  return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  const userId = await tokenService.checkRefreshToken(refreshToken);

  const user = await userService.getUser(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  
  await Token.destroy({
    where: {
      token: refreshToken,
    },
  });

  const tokens = await tokenService.generateAuthTokens(user);
  return tokens.accessToken;
};

module.exports = {
  login,
  refreshAuth,
};
