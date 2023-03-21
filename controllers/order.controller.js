const httpStatus = require("http-status");
const { orderService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getOrders = catchAsync(async (req, res) => {
  let { id } = req.user
  let orders = await orderService.getOrders(id);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: orders });
});

const createOrder = catchAsync(async (req, res) => {
  let user = req.user;

  const order = {
    customer_address,
    phone,
    pay_method
  } = req.body;

  order.user_id = user.id;

  let orderCreated = await orderService.createOrder(order);

  res.status(httpStatus.CREATED).send({code: httpStatus.CREATED, data: orderCreated});
});

const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  let user = req.user;

  const order = {
    customer_address,
    phone,
    pay_method
  } = req.body;
  order.user_id = user.id;

  let orderUpdate = await orderService.updateOrderById(id, order);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: orderUpdate });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  let user = req.user;

  await orderService.deletePostById(id, user.id);
  res.status(httpStatus.OK).send();
});

module.exports = { getOrders, createOrder, updateOrder, deleteOrder };
