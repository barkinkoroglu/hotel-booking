import User from '../models/User.js';

// Update a user
export const updateUser = async (req, res, next) => {
  try {
    // Find the user by the provided ID and update their details
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Send the updated user object in the response
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  try {
    // Find the user by the provided ID and delete them
    await User.findByIdAndDelete(req.params.id);

    // Send a success message in the response
    res.status(200).json('User has been deleted.');
  } catch (err) {
    next(err);
  }
};

// Get a user by ID
export const getUser = async (req, res, next) => {
  try {
    // Find the user by the provided ID
    const user = await User.findById(req.params.id);

    // Send the user object in the response
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
