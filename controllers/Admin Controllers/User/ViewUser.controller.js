const express = require('express');
const router = express.Router();
const Users = require('../../../models/users.model');



// Get all users
const getAllUsers = async (req, res) => {
    try {
      const users = await Users.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Deactivate/Activate user
  const toggleUserStatus = async (req, res) => {
    const userId = req.params.id;
    const { isActive } = req.body;

    console.log('Received isActive value:', isActive);

  
    try {
      const user = await Users.findByIdAndUpdate(userId, { isActive }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    getAllUsers,
    toggleUserStatus,
  };