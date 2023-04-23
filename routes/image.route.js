
const express = require('express');
const router = express.Router();

const { formDataService ,imageService } = require("../services")

router.post('/', async function (req, res, next) {
  let image = await formDataService.parseForm(req);
  let img = await imageService.uploadImg(image.file.filepath, "ha-anh")
  res.json(img)
})

module.exports = router;
