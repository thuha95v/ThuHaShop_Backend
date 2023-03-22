const express = require('express');
const { productController } = require('../controllers');
const authMiddleware = require("../middlewares/auth")

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/', authMiddleware.protect, productController.createProduct);
router.put("/:id", authMiddleware.protect, productController.updateCategory)
router.delete("/:id", authMiddleware.protect, productController.deleteProduct)

module.exports = router;
