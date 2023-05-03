const express = require('express');
const router = express.Router();
const { protect, authorize } = require("../../middlewares/auth")

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const productRouter = require('./product.route');
const cartRouter = require('./cart.route');
const postRouter = require('./post.route');
const orderRouter = require('./order.route');
const affiliateRoute = require("./campaign.route")

// No auth
const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/posts',
    route: postRouter
  },
  {
    path: '/products',
    route: productRouter
  },
];

const protectRoutes = [
  {
    path: '/categories',
    route: categoryRouter,
  },
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: "/orders",
    route: orderRouter
  },
  {
    path: "/cart",
    route: cartRouter
  },
  {
    path: "/affiliates",
    route: affiliateRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, protect, route.route);
});

module.exports = router;
