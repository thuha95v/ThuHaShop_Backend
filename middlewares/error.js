const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const db = require("../models")
const telegramQueue = require("../script/telegram")

const errorConverter = (err, req, res, next) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR
  let message = err.message
  
  if(err instanceof ApiError){
    return next(err)
  }

  if (err instanceof db.Sequelize.ValidationError){
    statusCode = httpStatus.BAD_REQUEST
    message = err.message.replace(/Validation error|notNull Violation/, "Kiểm tra lại")
  } 

  if(err instanceof db.Sequelize.ForeignKeyConstraintError){
    statusCode = httpStatus.BAD_REQUEST
    message = "Vui lòng kiểm tra khóa ngoại"
  }

  const error = new ApiError(statusCode, message, false, err.stack);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // if (process.env.NODE_ENV === 'production' && !err.isOperational) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  // }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    stack: err.stack,
  };

  console.error(err);

  telegramQueue.add({
    type: "ERROR",
    data: {
      code: statusCode,
      error: message
    }
  })

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};