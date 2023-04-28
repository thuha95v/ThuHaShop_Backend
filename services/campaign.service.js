const { Op } = require("sequelize");
const { Campaign, Product } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getAll = (userId) => {
  return Campaign.findAll({
    where: {
      user_id: userId,
    },
    include: { model: Product, as: "product", attributes: ["name", "slug"]}
  });
};

const create = async (data) => {
  const campaign = await Campaign.findOne({
    where: {
      user_id: data.user_id,
      product_id: data.product_id
    }
  })

  if (campaign) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Chiến dịch với sản phẩm này đã tồn tại");
  }
  
  const newCampaign = await Campaign.create(data);
  return newCampaign;
};

// const getById = async(id) => {
//   return Category.findByPk(id)
// }

const updateById = async (campaignId, data) => {
  const resultUpdate = await Campaign.update(data, {
    where: {
      id: campaignId,
      user_id: data.user_id
    },
    individualHooks: true,
  });

  if (resultUpdate[1].length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Chiến dịch không tồn tại hoặc bạn không có quyền sửa");
  }

  let campaign = await Campaign.findOne({
    where: {
      id: campaignId,
    },
    include: { model: Product, as: "product", attributes: ["name", "slug"]}
  })
  return campaign;
};

const deleteById = async (campaignId, userId) => {
  const campaign = await Campaign.destroy({
    where: {
      id: campaignId,
      user_id: userId
    },
    returning: true,
    plain: true,
  });

  if (!campaign) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Chiến dịch không tồn tại hoặc bạn không có quyền xóa"
    );
  }

};

module.exports = { getAll, create, updateById, deleteById };
