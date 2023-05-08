const httpStatus = require("http-status");
const { campaignService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getAllByUserId = catchAsync(async (req, res) => {
  let campaigns = await campaignService.getAllByUserId(req.user.id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: campaigns });
});

const getAll = catchAsync(async (req, res) => {
  let campaigns = await campaignService.getAll()
  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: campaigns });
});

const create = catchAsync(async (req, res) => {
  const { product_id } = req.body
  let campaign = await campaignService.create({ product_id, user_id: req.user.id});
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, data: {
    message: "Tạo thành công, vui lòng chờ chiến dịch được duyệt",
    ...campaign.dataValues
  }});
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params
  const { product_id } = req.body;
  const user_id = req.user.id
  let campaign = await campaignService.updateById(id,  { product_id, user_id });

  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: campaign });
});

const approve = catchAsync(async (req, res) => {
  const { id } = req.params
  const { status } = req.body;
  let campaign = await campaignService.approve(id, status);

  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: "Thành công" });
});

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  await campaignService.deleteById(id, req.user.id);

  res.status(httpStatus.OK).send();
});

module.exports = { getAll, approve, getAllByUserId, create, update, deleteById }