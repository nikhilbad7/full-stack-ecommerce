const AppError = require("../utils/AppError");

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }

    next();
  };
};

module.exports = requireRole;
