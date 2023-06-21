import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// User registration
export const register = async (req, res, next) => {
  try {
    // Generate a salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(200).send('User has been created.');
  } catch (err) {
    next(err);
  }
};

// User login
export const login = async (req, res, next) => {
  try {
    // Find the user by the provided username
    const user = await User.findOne({ username: req.body.username });

    // If the user doesn't exist, return a 404 error
    if (!user) return next(createError(404, 'User not found!'));

    // Compare the provided password with the hashed password stored in the database.
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If the password is incorrect, return a 400 error
    if (!isPasswordCorrect)
      return next(createError(400, 'Wrong password or username!'));

    // Generate a JWT token with the user ID and admin status
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    // Exclude the password and isAdmin field from the user details.
    const { password, isAdmin, ...otherDetails } = user._doc;

    // Set the JWT token as a cookie in the response and send the user details and admin status.
    res
      .cookie('access_token', token, {
        httpOnly: true,
        //An optional configuration object for the cookie. In this case, httpOnly is set to true,
        //which means the cookie is only accessible through the HTTP protocol and cannot be accessed or modified by client-side JavaScript.
        //This enhances the security of the token.
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
