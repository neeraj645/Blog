const successHandler = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data
  });
};

module.exports = successHandler;
