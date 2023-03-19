const express = require('express');
const { cartController } = require('../controllers');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/', cartController.createOrUpdate);
// router.put("/:id", productController.updateCategory)
// router.delete("/:id", productController.deleteProduct)

module.exports = router;
