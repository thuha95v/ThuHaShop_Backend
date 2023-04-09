const httpStatus = require("http-status");
const { productService, formDataService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getProducts = catchAsync(async (req, res) => {
  let { page, limit, q = ""} = req.query;
  if(!page || parseInt(page) < 0){
    page = 1;
  }

  if(!limit || parseInt(limit) > 100){
    limit = 10
  }

  let products = await productService.getProducts(page, limit, q);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, total: products.count, limit, data: products.rows });
});

const getProductById = catchAsync(async(req, res) => {
  const { id } = req.params

  const product = await productService.getProductById(id)

  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: product })
})

const createProduct = catchAsync(async (req, res) => {
  let bodyData = await formDataService.parseForm(req);

  const product = {
    category_id,
    name,
    short_desc,
    long_desc,
    provide_by,
    quantity,
    price,
    expiry,
    tags,
  } = bodyData.fields;

  const images = bodyData.images;
  let productCreated = await productService.createProduct(product, images);

  res.status(httpStatus.CREATED).send(productCreated);
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  let bodyData = await formDataService.parseForm(req);

  const product = {
    category_id,
    name,
    short_desc,
    long_desc,
    provide_by,
    quantity,
    price,
    expiry,
    tags,
  } = bodyData.fields;

  const images = bodyData.images;

  let productUpdate = await productService.updateProductById(id, product, images);

  res.status(httpStatus.OK).send({ code: httpStatus.OK, data: productUpdate });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProductById(id);

  res.status(httpStatus.OK).send();
});

module.exports = { getProductById, getProducts, createProduct, updateCategory, deleteProduct };
