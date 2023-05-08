const express = require('express');
const { orderController } = require('../../controllers');

const router = express.Router();

router.get('/', orderController.getAll);
// router.post('/', campaignController.create);
router.put("/:id", orderController.approve)
// router.delete("/:id", campaignController.deleteById)

module.exports = router;
