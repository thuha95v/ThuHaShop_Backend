const { Op } = require("sequelize");
const { Category } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Get categorys
 *@returns {Promise[Category]};
 */
const getCategories = () => {
  return Category.findAll();
};

const createCategory = async (name) => {
  const category = await Category.create({ name });

  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tạo thể loại lỗi");
  }

  return category;
};

const getById = async(id) => {
  return Category.findByPk(id)
}

const updateCategoryById = async (categoryId, name) => {
  const resultUpdate = await Category.update({ name }, {
    where: {
      id: categoryId,
    },
    individualHooks: true,
  });

  if (resultUpdate[1].length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Lỗi cập nhật thể loại");
  }

  let category = await Category.findByPk(categoryId)
  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await Category.destroy({
    where: {
      id: categoryId,
    },
    returning: true,
    plain: true,
  });

  if (!category) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "id không tồn tại"
    );
  }

};

module.exports = { getById, getCategories, createCategory, deleteCategoryById, updateCategoryById };
