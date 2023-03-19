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
  const { products, history } = req.body
  await cartService.createOrUpdateCart(user.id, products);

  res.status(httpStatus.CREATED).send();
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params
  await categoryService.deleteCategoryById(id);

  res.status(httpStatus.OK).send();
});

module.exports = { getCart, createOrUpdate }