class ResponseHandler {
  static sendSuccess = (res, data, statusCode = 200, message) => {
    return res.status(statusCode).json({
      data,
      message,
    });
  };
}

module.exports = ResponseHandler;
