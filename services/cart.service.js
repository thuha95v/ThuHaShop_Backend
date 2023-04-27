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

const createOrUpdateCart = async (userId, data) => {
  const result = await Promise.all([
    CartManage.findOne({ where: { user_id: userId } }),
    Product.findAll({
      where: {
        id: data.map(p => p.product_id),
      },
      attributes: ['id', 'quantity', "name"]
    })
  ]) 

  const [ cartManage, products ] = result

  const mapProduct = new Map()

  for (const product of products) {
    mapProduct.set(product.id, `${product.name}:${product.quantity}`)
  }

  let cartId = cartManage?.id;
  for (const product of data) {
    let [ name, quantity ] = mapProduct.get(product.product_id).split(":")
    if(product.quantity > parseInt(quantity)){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sản phẩm ${name} không đủ số lượng trong kho` );
    }
  }

  if (!cartManage) {
    const newCartManage = await CartManage.create({ user_id: userId });
    cartId = newCartManage.id
  } else {
    await Cart.destroy({
      where: {
        cart_id: cartManage.id,
      },
      returning: true,
      plain: true,
    });
  }

  let arrProduct = data.map((product) => {
      return {
        ...product,
        cart_id: cartId,
      };
  });

  await Cart.bulkCreate(arrProduct); 
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

const updateShareCart = async(shareId, data, history) => {
  const cartManage = await CartManage.findOne({ where: { link: shareId } });

  if(!cartManage || cartManage.status != "open"){
    throw new ApiError(httpStatus.NOT_FOUND, "Giỏ hàng không tồn tại hoặc không mở share")
  }

  const products = await Product.findAll({
    where: {
      id: data.map(p => p.product_id),
    },
    attributes: ['id', 'quantity', "name"]
  })

  const mapProduct = new Map()
  for (const product of products) {
    mapProduct.set(product.id, `${product.name}:${product.quantity}`)
  }

  if(mapProduct.size == 0){
    throw new ApiError(httpStatus.BAD_REQUEST, `Sản phẩm không tồn tại` );
  }

  for (const product of data) {
    let [ name, quantity ] = mapProduct.get(product.product_id).split(":")
    if(product.quantity > parseInt(quantity)){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sản phẩm ${name} không đủ số lượng trong kho` );
    }
  }

  if (cartManage.history.length == 0) {
    cartManage.history = history
  } else { 
    cartManage.history.push(...history)
    cartManage.changed('history', true);
  }
  
  await cartManage.save()
  
  await Cart.destroy({
    where: {
      cart_id: cartManage.id,
    },
    returning: true,
    plain: true,
  });

  let arrProduct = data.map((product) => {
    return {
      ...product,
      cart_id: cartManage.id,
    };
  });

  await Cart.bulkCreate(arrProduct);
}

module.exports = { getCartByUserId, createOrUpdateCart, openShareCart, closeShareCart, updateShareCart };
