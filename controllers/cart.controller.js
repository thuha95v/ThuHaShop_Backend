const httpStatus = require("http-status");
const { cartService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getCart = catchAsync(async (req, res) => {
  let user = req.user;
  let cart = await cartService.getCartByUserId(user.id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: cart });
});

const createOrUpdate = catchAsync(async (req, res) => {
  let user = req.user;
  const { products } = req.body
  await cartService.createOrUpdateCart(user.id, products);

  res.status(httpStatus.CREATED).send({ code: httpStatus.OK, data: "Thành công" });
});

const openShareCart = catchAsync(async (req, res) => {
  let user = req.user;
  let cart = await cartService.openShareCart(user.id)
  
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: {
    message: "Bật chia sẻ giỏ hàng thành công",
    data: cart.link
  } });
});

const closeShareCart = catchAsync(async (req, res) => {
  let user = req.user;
  let cart = await cartService.closeShareCart(user.id)
  
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: "Tắt chia sẻ giỏ hàng thành công" });
});

const updateShareCart = catchAsync(async (req, res) => {
  let { shareId = ""} = req.params;
  let { products, history } = req.body

  await cartService.updateShareCart(shareId, products, history)
  
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: "Cập nhật thành công" });
});

module.exports = { getCart, createOrUpdate, openShareCart, closeShareCart, updateShareCart }