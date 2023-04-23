const httpStatus = require("http-status");
const { cartService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getCart = catchAsync(async (req, res) => {
  let user = req.user;
  let cart = await cartService.getCartByUserId(user.id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: cart });
});

const createOrUpdate = async (userId, products) => {
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