const express = require('express');
const { postController } = require('../../controllers');
const authMiddleware = require("../../middlewares/auth")

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

module.exports = router;
