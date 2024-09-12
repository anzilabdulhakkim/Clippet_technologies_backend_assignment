const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a user
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, profession } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone, profession });
    res.status(201).json({ message: 'User registered successfully', user });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user data
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ message: 'User updated successfully' });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};
