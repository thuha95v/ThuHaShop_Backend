const httpStatus = require("http-status");
const { orderService, orderProductService } = require("../services");
const telegramQueue = require("../script/telegram")
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
    pay_method,
    products,
    note
  } = req.body;

  order.user_id = user.id;

  let orderCreated = await orderService.createOrder(order);
  let orderProduct = await orderProductService.create(orderCreated.id, products)
  telegramQueue.add({ type: "ORDER", data: { orderId: orderCreated.id, userId: user.id, status: orderCreated.status } })
  res.status(httpStatus.CREATED).send({code: httpStatus.CREATED, data: orderCreated});
});

const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  let user = req.user;

  const order = {
    status
  } = req.body;
  order.user_id = user.id;

  let orderUpdate = await orderService.updateOrderById(id, order);
  telegramQueue.add({ type: "ORDER", data: { orderId: orderUpdate.id, userId: user.id, status: orderUpdate.status } })
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: orderUpdate });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  let user = req.user;

  await orderService.deletePostById(id, user.id);
  res.status(httpStatus.OK).send();
});

module.exports = { getOrders, createOrder, updateOrder, deleteOrder };
