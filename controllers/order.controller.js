const httpStatus = require("http-status");
const { orderService, orderProductService } = require("../services");
const { telegramQueue, productQueue, orderQueue } = require("../script")
const catchAsync = require("../utils/catchAsync");

const getOrdersByUserId = catchAsync(async (req, res) => {
  let { id } = req.user
  let orders = await orderService.getOrdersByUserId(id);
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
  productQueue.add({ type: "QUANTITY", data: products})
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

const approve = catchAsync(async (req, res) => {
  const { id } = req.params
  const { status, note } = req.body;
  await orderService.approve(id, status);

  if(status == "fail"){
    orderQueue.add({ type: "FAIL", data: { id, note } })
  }
  
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: "Thành công" });
});

const getAll = catchAsync(async (req, res) => {
  const { status } = req.query
  let orders = await orderService.getAll(status);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: orders });
});

module.exports = { getAll, getOrdersByUserId, createOrder, updateOrder, deleteOrder, approve };
