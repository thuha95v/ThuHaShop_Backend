const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/user");

const { jwt: jwtConfig } = require("../config/config")

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, httpStatus.UNAUTHORIZED)
    );
  }
  const decodedToken = jwt.verify(token, jwtConfig.accessSecret);
  const { userId } = decodedToken;
  const user = await User.findByPk(userId);

  if (!user) {
    new ApiError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED);
  }

  req.user = user;
  return next();
};
