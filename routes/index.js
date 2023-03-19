const express = require('express');
const router = express.Router();
// const userRouter = require('./user.route');
const authMiddleware = require("../middlewares/auth")

const authRouter = require('./auth.route');
const categoryRouter = require('./category.route');
const imageRouter = require('./image.route');
const productRouter = require('./product.route');
const cartRouter = require('./cart.route');


// No auth
const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
];

const protectRoutes = [
  {
    path: '/categories',
    route: categoryRouter,
  },
  {
    path: "/images",
    route: imageRouter
  },
  {
    path: "/products",
    route: productRouter
  },
  {
    path: "/cart",
    route: cartRouter
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, authMiddleware.protect, route.route);
});

module.exports = router;
