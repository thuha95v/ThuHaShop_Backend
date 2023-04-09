const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const db = require("../models")

const errorConverter = (err, req, res, next) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR
  let message = httpStatus[statusCode]

  if (err instanceof db.Sequelize.ValidationError){
    statusCode = httpStatus.BAD_REQUEST
    message = err.message.replace(/Validation error|notNull Violation/, "Kiểm tra lại")
  } 
  else if (!(err instanceof ApiError)) {
    message = err.message;
  }else {
    return next(err)
  }

  const error = new ApiError(statusCode, message, false, err.stack);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};