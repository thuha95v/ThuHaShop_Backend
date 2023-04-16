const express = require('express');
const { orderController } = require('../controllers');
const authMiddleware = require("../middlewares/auth")

const router = express.Router();

router.get('/', authMiddleware.protect, orderController.getOrders);
router.post('/', authMiddleware.protect, orderController.createOrder);
// router.put("/:id", authMiddleware.protect, orderController.updateOrder)
// router.delete("/:id", authMiddleware.protect, orderController.deleteOrder)

module.exports = router;
