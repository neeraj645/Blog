const ik = require("../config/imageKit");

const attachImageKit = (req, res, next) => {
  req.imageKit = ik;
  next();
};

module.exports = attachImageKit;
