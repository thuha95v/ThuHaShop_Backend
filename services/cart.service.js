const { Op } = require("sequelize");
const { Cart, CartManage, Product } = require("../models");
const idService = require("./id.service")
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getCartByUserId = async (userId) => {
  const cartManage = await CartManage.findOne({ where: { user_id: userId } });

  if(!cartManage){
    throw new ApiError(httpStatus.NOT_FOUND, "Giỏ hàng trống")
  }

  const cart = await Cart.findAll({
    where: { cart_id: cartManage.id },
    include: { model: Product, as: "product", attributes: {
      exclude: ["quantity", "createdAt", "updatedAt", "category_id"]
    } 
  },
  });

  let result = {
    ...cartManage.dataValues,
    data: cart.map(c => {
      c.product.quantity = c.quantity
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

const openShareCart = async(userId) => {
  const cartManage = await CartManage.findOne({ where: { user_id: userId } });

  if(cartManage.link != "" && cartManage.status != "close"){
    return cartManage
  }

  let shareId = idService.generateId()
  cartManage.link = shareId
  cartManage.status = "open"
  return cartManage.save()
}

const closeShareCart = async(userId) => {
  const cartManage = await CartManage.findOne({ where: { user_id: userId } });

  cartManage.link = ""
  cartManage.status = "close"
  return cartManage.save()
}

const updateShareCart = async(shareId, products, history) => {
  const cartManage = await CartManage.findOne({ where: { link: shareId } });

  if(!cartManage || cartManage.status != "open"){
    throw new ApiError(httpStatus.NOT_FOUND, "Giỏ hàng không tồn tại hoặc không mở share")
  }


  cartManage.history = history
  await cartManage.save()
  
  await Cart.destroy({
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

module.exports = { getCartByUserId, createOrUpdateCart, openShareCart, closeShareCart, updateShareCart };
