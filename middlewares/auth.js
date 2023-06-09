const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { User } = require("../models");

const { jwt: jwtConfig } = require("../config")
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "token là bắt buộc")
    );
  }
  const decodedToken = jwt.verify(token, jwtConfig.accessSecret);
  const { sub: userId } = decodedToken;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "token không hợp lệ");
  }
  req.user = user;
  return next();
});

const authorize = (roles) => catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  if(!roles.includes(user.role)){
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền thao tác');
  }

  return next();
});

module.exports = { protect, authorize }