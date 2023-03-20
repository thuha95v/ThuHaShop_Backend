const { Op } = require("sequelize");
const { Post } = require("../models");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getPosts = () => {
  return Post.findAll();
};

const createPost = async (postBody) => {
  const post = await Post.create(postBody);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tạo bài viết lỗi");
  }

  return post
};

const updatePostById = async (postId, postBody) => {
  const resultUpdate = await Post.update(postBody, {
    where: {
      id: postId,
      user_id: postBody.user_id
    },
    individualHooks: true,
  });

  if (resultUpdate[1].length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bạn không có quyền cập nhật bài viết này");
  }

  let post = await Post.findByPk(postId)
  return post;
};

const deletePostById = async (postId, userId) => {
  const post = await Post.destroy({
    where: {
      id: postId,
      user_id: userId
    },
    returning: true,
    plain: true,
  });

  if (!post) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Bài viết không tồn tại hoặc bạn không có quyền xóa"
    );
  }
};

module.exports = { getPosts, createPost, updatePostById, deletePostById };
