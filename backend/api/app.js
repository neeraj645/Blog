const express = require("express");
const AppError = require("../utils/AppError");
const errorHandler = require("../middlewares/errorHandler");
const successHandler = require("../middlewares/successHandler");
const userRoutes = require("../routes/userRoutes");
const blogRoutes = require("../routes/blogRoutes");
const database = require("../config/db");
const cors = require('cors'); // Import the cors package

const app = express();
app.use(express.json());

// Connect to database
database();

app.use(cors());

// Example route - success
app.get("/api/success", (req, res) => {
  const data = { user: "John Doe", role: "Admin" };
  return successHandler(res, data, "User fetched successfully", 200);
});

// Example route - error
app.get("/api/error", (req, res, next) => {
  return next(new AppError("This is a test error", 400));
});

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
// Handle 404
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Global error handler
app.use(errorHandler);

module.exports = app;
