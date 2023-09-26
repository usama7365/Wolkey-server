// filter.controller.js
const Filter = require('../../models/AdminModels/filter.model');

// Create a filter
const createFilter = async (req, res) => {
    try {
      const filter = await Filter.create(req.body);
      res.status(201).json(filter);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get all filters
  const getAllFilters = async (req, res) => {
    try {
      const filters = await Filter.find();
      res.json(filters);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Get a filter by ID
const getFilterById = async (req, res) => {
  const filterId = req.params.id;
  try {
    const filter = await Filter.findById(filterId);
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }
    res.json(filter);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a filter by ID
const updateFilter = async (req, res) => {
  const filterId = req.params.id;
  try {
    const filter = await Filter.findByIdAndUpdate(filterId, req.body, { new: true });
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }
    res.json(filter);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a filter by ID
const deleteFilter = async (req, res) => {
  const filterId = req.params.id;
  try {
    const filter = await Filter.findByIdAndDelete(filterId);
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }
    res.json({ message: 'Filter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createFilter,
  getAllFilters,
  getFilterById,
  updateFilter,
  deleteFilter,
};