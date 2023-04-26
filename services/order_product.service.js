const { Op } = require("sequelize");
const { ProductOrder, Product } = require("../models");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getAll = (userId) => {
  return ProductOrder.findAll({
    user_id: userId,
  })
};

const getAllByOrderID = (orderId) => {
  return ProductOrder.findAll({
    where: {
      order_id: orderId,
    },
    include: { 
      model: Product, as: "product",
      attributes: {
        exclude: ["createdAt", "quantity", "updatedAt", "order_id", "product_id"]
      },
    }
  })
};

const create = async (orderId, data) => {
  let orderProduct = data.map((p) => {
    return {
      order_id: orderId,
      ...p
    }
  })

  await ProductOrder.bulkCreate(orderProduct)

  // return orderProduct
}

//   if (order) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Địa chỉ hoặc số điện thoại đã tồn tại");
//   }

//   let orderCreated = await Order.create(orderBody);
//   if (!orderCreated) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Tạo order lỗi");
//   }

//   return orderCreated
// };

// const updateOrderById = async (orderId, orderBody) => {
//   const resultUpdate = await Order.update(orderBody, {
//     where: {
//       id: orderId,
//       user_id: orderBody.user_id
//     },
//     individualHooks: true,
//   });

//   if (resultUpdate[1].length == 0) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Bạn không có quyền cập nhật");
//   }

//   let order = await Order.findByPk(orderId)
//   return order;
// };

// const deletePostById = async (orderId, userId) => {
//   const order = await Order.destroy({
//     where: {
//       id: orderId,
//       user_id: userId
//     },
//     returning: true,
//     plain: true,
//   });

//   if (!order) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "Order không tồn tại hoặc bạn không có quyền xóa"
//     );
//   }
// };

module.exports = { create, getAll, getAllByOrderID };
