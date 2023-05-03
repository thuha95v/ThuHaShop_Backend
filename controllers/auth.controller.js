const httpStatus = require("http-status");
const { authService, userService, tokenService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send();
});

const login = catchAsync(async (req, res) => {
  const { account, password } = req.body;
  const user = await authService.login(account, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const accessToken = await authService.refreshAuth(req.body.refresh_token);
  res.send({ accessToken });
});

module.exports = {
  register,
  login,
};
