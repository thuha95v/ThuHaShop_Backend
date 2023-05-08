const express = require('express');
const { campaignController } = require('../../controllers');

const router = express.Router();

router.get('/', campaignController.getAll);
// router.post('/', campaignController.create);
router.put("/:id", campaignController.approve)
// router.delete("/:id", campaignController.deleteById)

module.exports = router;
