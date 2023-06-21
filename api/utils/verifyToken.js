import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

// Middleware to verify the JWT token
export const verifyToken = (req, res, next) => {
  // Retrieve the token from the request cookies
  const token = req.cookies.access_token;

  // If the token is not present, return a 401 Unauthorized error
  if (!token) {
    return next(createError(401, 'You are not authenticated!'));
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT, (err, user) => {
    // If there's an error or the token is not valid, return a 403 Forbidden error
    if (err) return next(createError(403, 'Token is not valid!'));

    // Set the user object in the request for further processing
    req.user = user;
    next();
  });
};

// Middleware to verify the user's authorization
export const verifyUser = (req, res, next) => {
  // Use the verifyToken middleware to validate the token first
  verifyToken(req, res, () => {
    // Check if the authenticated user's ID matches the requested user's ID or if the user is an admin
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      // If not authorized, return a 403 Forbidden error
      return next(createError(403, 'You are not authorized!'));
    }
  });
};

// Middleware to verify the admin's authorization
export const verifyAdmin = (req, res, next) => {
  // Use the verifyToken middleware to validate the token first
  verifyToken(req, res, () => {
    // Check if the authenticated user is an admin
    if (req.user.isAdmin) {
      next();
    } else {
      // If not authorized, return a 403 Forbidden error
      return next(createError(403, 'You are not authorized!'));
    }
  });
};
