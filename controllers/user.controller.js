const httpStatus = require("http-status");
const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getMe = catchAsync(async (req, res) => {
  const { id } = req.user;
  let user = await userService.getUserById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: user });
});

const getUsers = catchAsync(async (req, res) => {
  let users = await userService.getUsers()
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: users });
});

const lockAndUnlock = catchAsync(async (req, res) => {
  const { user_id, isLock } = req.body
  await userService.lockAndUnlock(user_id, isLock);

  if(isLock){
    res.send({ code: httpStatus.OK, data: "Khóa tài khoản thành công" });
  }else {
    res.send({ code: httpStatus.OK, data: "Mở tài khoản thành công" });
  }
});

module.exports = {
  getMe,
  getUsers,
  lockAndUnlock
};
