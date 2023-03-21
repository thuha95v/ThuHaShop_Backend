const { Op } = require("sequelize");
const { Order } = require("../models");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getOrders = (userId) => {
  return Order.findAll({
    user_id: userId
  }
  );
};

const createOrder = async (orderBody) => {
  const order = await Order.create(orderBody);
  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tạo order lỗi");
  }

  return order
};

const updateOrderById = async (orderId, orderBody) => {
  const resultUpdate = await Order.update(orderBody, {
    where: {
      id: orderId,
      user_id: orderBody.user_id
    },
    individualHooks: true,
  });

  if (resultUpdate[1].length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bạn không có quyền cập nhật");
  }

  let order = await Order.findByPk(orderId)
  return order;
};

const deletePostById = async (orderId, userId) => {
  const order = await Order.destroy({
    where: {
      id: orderId,
      user_id: userId
    },
    returning: true,
    plain: true,
  });

  if (!order) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Order không tồn tại hoặc bạn không có quyền xóa"
    );
  }
};

module.exports = { getOrders, createOrder, updateOrderById, deletePostById};
