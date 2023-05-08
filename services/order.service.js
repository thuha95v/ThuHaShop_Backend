const { Op } = require("sequelize");
const { Order, ProductOrder, Product } = require("../models");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getById = (id) => {
  return Order.findByPk(id)
}

const getAll = (status) => {
  let query = {}

  if(status.length > 0){
    query = { where: { status } }
  }
  return Order.findAll(query);
}

const getOrdersByUserId = (userId) => {
  return Order.findAll({
    user_id: userId,
    include: { 
      model: ProductOrder, as: "products",
      attributes: {
        exclude: ["createdAt", "updatedAt", "order_id", "product_id"]
      },
      include: {
        model: Product, as: "product",
        attributes: {
          exclude: ["quantity", "createdAt", "updatedAt", "category_id"]
        }
      }

    },
    attributes: {
      exclude: ["createdAt", "updatedAt"]
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

const approve = async (orderId, status) => {
  const resultUpdate = await Order.update({ status }, {
    where: {
      id: orderId,
    },
    individualHooks: true,
  });

  if (resultUpdate[1].length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Đơn hàng không tồn tại");
  }

  let order = await Order.findByPk(orderId)
  return order;
};

module.exports = { getAll, getOrdersByUserId, createOrder, updateOrderById, deletePostById, approve, getById};
