const express = require('express');
const router = express.Router();
// const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const categoryRouter = require('./category.route');
const imageRouter = require('./image.route');


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
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
