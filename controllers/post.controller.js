const httpStatus = require("http-status");
const { postService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getPosts = catchAsync(async (req, res) => {
  let { page, limit, q = "" } = req.query;
  if(!page || parseInt(page) < 0){
    page = 1;
  }

  if(!limit || parseInt(limit) > 100){
    limit = 10
  }
  
  let posts = await postService.getPosts(page, limit, q);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, total: posts.count, limit, data: posts.rows });
});

const getPostById = catchAsync(async(req, res) => {
  const { id } = req.params

  const post = await postService.getPostById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: post })
})

const createPost = catchAsync(async (req, res) => {
  let user = req.user;

  const post = {
    title,
    content,
    tags
  } = req.body;

  post.user_id = user.id;

  let productCreated = await postService.create(post);

  res.status(httpStatus.CREATED).send({code: httpStatus.CREATED, data: productCreated});
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  let user = req.user;

  const post = {
    title,
    content,
    tags
  } = req.body;
  post.user_id = user.id;

  let productUpdate = await postService.updatePostById(id, post);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: productUpdate });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  let user = req.user;

  await postService.deletePostById(id, user.id);
  res.status(httpStatus.OK).send();
});

module.exports = { getPostById, getPosts, createPost, updatePost, deletePost };
