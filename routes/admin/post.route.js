const express = require('express');
const { postController } = require('../../controllers');
const authMiddleware = require("../../middlewares/auth")

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', authMiddleware.protect, postController.createPost);
router.put("/:id", authMiddleware.protect, postController.updatePost)
router.delete("/:id", authMiddleware.protect, postController.deletePost)

module.exports = router;
