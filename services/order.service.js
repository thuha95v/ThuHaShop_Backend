const { Op } = require("sequelize");
const { Order, ProductOrder, Product } = require("../models");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getOrders = (userId) => {
  return Order.findAll({
    user_id: userId,
    include: { 
      model: ProductOrder, as: "products",
      include: {
        model: Product, as: "info",
        attributes: {
          exclude: ["quanlity", "createdAt", "updatedAt", "category_id"]
        }
      }

    }
  }
  );
};

const createOrder = async (orderBody) => {
  // let order = await Order.findOne({
  //   where: {
  //     customer_address: orderBody.customer_address,
  //     phone: orderBody.phone
  //   }
  // });


  // if (order) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Địa chỉ hoặc số điện thoại đã tồn tại");
  // }

  let orderCreated = await Order.create(orderBody);
  if (!orderCreated) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tạo order lỗi");
  }

  return orderCreated
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
