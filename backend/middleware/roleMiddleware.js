// backend/middleware/roleMiddleware.js
const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      // This should ideally be caught by authMiddleware first, but good safeguard
      return res.status(401).json({ success: false, message: 'Not authenticated: User role not found.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource.' });
    }

    next();
  };
};

module.exports = authorizeRoles;
