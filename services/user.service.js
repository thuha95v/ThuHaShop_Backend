const { Op } = require("sequelize");
const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getUsers = () => {
  return User.findAll();
};

const getUserById = (id) => {
  return User.findByPk(id);
};

/**
 * Get user by userId
 * @param {ObjectId} userId ;
 * @returns {Promise<userModel>};
 * @returns {Promise<userModel>};
 */

const getUser = async (userId) => {
  const user = await User.findByPk(userId);

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
  const user = await User.create(userCreate);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};

const lockAndUnlock = async (userId, isLock) => {
  const user = await User.update(
    { isLock },
    {
      where: {
        id: userId,
      },
      returning: true,
    }
  );

  if (user[1] == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Người dùng không tồn tại");
  }

  return user;
};

/**
 * Update user by userid
 * @param {<ObjectUser>} userUpdate ;
 * @param {<ObjectId>} userId ;
 * @returns {<Promise<userModel>};
 */

const updateUser = async (userId, userUpdate) => {
  const user = await User.update(userUpdate, {
    where: {
      id: userId,
    },
    returning: true,
    plain: true,
  });

  console.log(user);
  if (user[1] == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Người dùng không tồn tại");
  }

  return user;
};

/**
 * Delete user by userId
 * @param {<ObjectId>} userId
 * @returns {Promise<>}
 */

const deleteUser = async (userId) => {
  const user = await User.destroy({
    where: {
      id: userId,
    },
    returning: true,
    plain: true,
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "");
  }

  return user;
};

/**
 * Get user by account
 * @param {<{ObjectId}>} account
 * @returns {<Promise<userModel>}
 */

const getUserByAccount = async (account) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        {
          username: account,
        },
        {
          email: account,
        },
      ],
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tài khoản không tồn tại");
  }

  if (user.isLock) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tài khoản của bạn đã bị khóa");
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
  getUserById,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByAccount,
  getUserByEmail,
  lockAndUnlock,
};
