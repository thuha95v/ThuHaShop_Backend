const express = require('express');
const { categoryController } = require('../controllers');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put("/:id", categoryController.updateCategory)
router.delete("/:id", categoryController.deleteCategory)

module.exports = router;
