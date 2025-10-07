const errorHandler = (err, req, res, next) => {
  // If error doesn't have statusCode, set default
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = errorHandler;
