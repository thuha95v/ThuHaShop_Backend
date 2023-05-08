const express = require('express');
const { campaignController } = require('../../controllers');

const router = express.Router();

router.get('/', campaignController.getAllByUserId);
router.post('/', campaignController.create);
router.put("/:id", campaignController.update)
router.delete("/:id", campaignController.deleteById)

module.exports = router;
