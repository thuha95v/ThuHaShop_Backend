const { Op, where } = require("sequelize");
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

  let products = await Product.findAll({
    where: {
      id: data.map(p => p.product_id),
    },
    attributes: ['id', 'quantity', "name"]
  })

  const mapProduct = new Map()

  for (const product of products) {
    mapProduct.set(product.id, `${product.name}:${product.quantity}`)
  }

  const updatePromises = []
  for (const product of orderProduct) {
    let [ name, quantity ] = mapProduct.get(product.product_id).split(":")
    if(product.quantity > parseInt(quantity)){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sản phẩm ${name} không đủ số lượng trong kho` );
    }else {
      updatePromises.push(Product.update({ quantity: parseInt(quantity) - product.quantity }, {
        where: {
          id: product.product_id,
        }
      }))
    }
  }

  await Promise.all(updatePromises)
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
