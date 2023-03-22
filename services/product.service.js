const { Op } = require("sequelize");
const { Product } = require("../models");
const { imageService } = require("./index");

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getProducts = (page, limit, name) => {
  return Product.findAndCountAll({
    where: {
      name: {
        [Op.like]: `${name}%`
      },
    },
    limit: parseInt(limit - 1),
    offset: parseInt(page * limit)
  });
};

const createProduct = async (productBody, imageUpload) => {
  let images = await imageService.uploadManyImg(imageUpload, "ha-anh")

  const product = await Product.create({...productBody, images });
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tạo sản phẩm lỗi");
  }

  return product
};

const updateProductById = async (productId, productBody, imageUpload) => {

  let images = await imageService.uploadManyImg(imageUpload, "ha-anh")

  const resultUpdate = await Product.update({...productBody, images}, {
    where: {
      id: productId,
    },
    individualHooks: true,
  });

  if (resultUpdate[1].length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Lỗi cập nhật sản phẩm");
  }

  let product = await Product.findByPk(productId)
  return product;
};

const deleteProductById = async (productId) => {
  const product = await Product.destroy({
    where: {
      id: productId,
    },
    returning: true,
    plain: true,
  });

  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "id không tồn tại"
    );
  }
};

module.exports = { getProducts, createProduct, updateProductById, deleteProductById };
