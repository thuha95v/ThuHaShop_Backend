const httpStatus = require("http-status");
const { categoryService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getCategories = catchAsync(async (req, res) => {
  let categories = await categoryService.getCategories()
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: categories });
});

const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body
  await categoryService.createCategory(name);

  res.status(httpStatus.CREATED).send();
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params
  const { name } = req.body;
  let category = await categoryService.updateCategoryById(id, name);

  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: category });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params
  await categoryService.deleteCategoryById(id);

  res.status(httpStatus.OK).send();
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }