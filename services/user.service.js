const { Op } = require("sequelize");
const models = require("../models/index.js");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const userModel = models.User;

/**
 * Get users
 *@returns {Promise<userModel>};
 */
const getUsers = () => {
  return userModel.findAll();
};

/**
 * Get user by userId
 * @param {ObjectId} userId ;
 * @returns {Promise<userModel>};
 * @returns {Promise<userModel>};
 */

const getUser = async (userId) => {
  const user = await userModel.findByPk(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Can not found user by user id ");
  }

  return user;
};

/**
 * Create a new user
 * @param {<ObjectUser>} userCreate ;
 * @returns {Promise<user>};
 */

const createUser = async (userCreate) => {
  const user = await userModel.create(userCreate);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};

/**
 * Update user by userid
 * @param {<ObjectUser>} userUpdate ;
 * @param {<ObjectId>} userId ;
 * @returns {<Promise<userModel>};
 */

const updateUser = async (userUpdate, userId) => {
  const user = await userModel.update(userUpdate, {
    where: {
      id: userId,
    },
    returning: true,
    plain: true,
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not update user");
  }

  return user;
};

/**
 * Delete user by userId
 * @param {<ObjectId>} userId
 * @returns {Promise<>}
 */

const deleteUser = async (userId) => {
  const user = await userModel.destroy({
    where: {
      id: userId,
    },
    returning: true,
    plain: true,
  });

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Can not delete user with userId"
    );
  }

  return user;
};

/**
 * Get user by account
 * @param {<{ObjectId}>} account
 * @returns {<Promise<userModel>}
 */

const getUserByAccount = async (account) => {
  const user = await userModel.findOne({
    where: {
      [Op.or]: [
				{
					username: account
				},
				{
					email: account
				}
			]
    },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Tài khoản không tồn tại"
    );
  }

  return user;
};

/**
 * Get user by email user
 * @param {<ObjectEmail>} emailUser
 * @returns {Promise<userModel>}
 */

const getUserByEmail = async (emailUser) => {
  const user = await userModel.findOne({
    where: {
      email: emailUser,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Can not found with email user");
  }

  return user;
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByAccount,
  getUserByEmail,
};
