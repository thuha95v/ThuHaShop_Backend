const { Op } = require("sequelize");
const { Cart, CartManage, Product } = require("../models");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getCartByUserId = async (userId) => {
  const cartManage = await CartManage.findOne({ where: { user_id: userId } });
  const cart = await Cart.findAll({
    where: { cart_id: cartManage.id },
    include: { model: Product, as: "product", attributes: {
      exclude: ["quanlity", "createdAt", "updatedAt", "category_id"]
    } 
  },
  });

  let result = {
    ...cartManage.dataValues,
    data: cart.map(c => {
      return c.product
    })
  };

  return result;
};

const createOrUpdateCart = async (userId, products) => {
  const cartManage = await CartManage.findOne({ where: { user_id: userId } });

  if (!cartManage) {
    const newCartManage = await CartManage.create({ user_id: userId });
    let arrProduct = products.map((product) => {
      return {
        product_id: product,
        cart_id: newCartManage.id,
      };
    });

    await Cart.bulkCreate(arrProduct);
  } else {
    const deleteResult = await Cart.destroy({
      where: {
        cart_id: cartManage.id,
      },
      returning: true,
      plain: true,
    });

    let arrProduct = products.map((product) => {
      return {
        ...product,
        cart_id: cartManage.id,
      };
    });

    await Cart.bulkCreate(arrProduct);
  }
};


module.exports = { getCartByUserId, createOrUpdateCart };
