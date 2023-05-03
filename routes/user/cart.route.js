const express = require('express');
const { cartController } = require('../../controllers');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/', cartController.createOrUpdate);
router.post("/open", cartController.openShareCart)
router.post("/close", cartController.closeShareCart)
router.post("/share/:shareId", cartController.updateShareCart)

// router.delete("/:id", productController.deleteProduct)

module.exports = router;
