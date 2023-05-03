const express = require('express');
const { userController } = require('../../controllers');

const router = express.Router();

router.get('/', userController.getUsers);
// router.post('/', categoryController.createCategory);
router.post('/', userController.lockAndUnlock);
// router.put("/:id", categoryController.updateCategory)
// router.delete("/:id", categoryController.deleteCategory)

module.exports = router;
