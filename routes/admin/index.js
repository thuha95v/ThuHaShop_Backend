const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const postRouter = require('./post.route');
const productRouter = require('./product.route');
const affiliateRoute = require('./campaign.route');
const orderRoute = require('./order.route');

const { protect, authorize } = require("../../middlewares/auth")

const adminRoutes = [
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/categories',
    route: categoryRouter,
  },
  {
    path: '/posts',
    route: postRouter
  },
  {
    path: '/products',
    route: productRouter
  },
  {
    path: "/affiliates",
    route: affiliateRoute
  },
  {
    path: "/orders",
    route: orderRoute
  }
];

adminRoutes.forEach((route) => {
  router.use(route.path, protect, authorize(["admin"]), route.route);
});

module.exports = router;
