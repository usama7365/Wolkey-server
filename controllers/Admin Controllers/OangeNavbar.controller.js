const OrangeNavbar = require('../../models/AdminModels/OrangeNavbar.model');

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if the maximum limit of 6 items is reached
    const menuItemsCount = await OrangeNavbar.countDocuments();
    if (menuItemsCount >= 6) {
      return res.status(400).json({ error: 'Maximum limit of 7 items reached' });
    }

    const menuItem = new OrangeNavbar({ title });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the menu item' });
  }
};

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await OrangeNavbar.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching menu items' });
  }
};

// Edit a menu item by ID
exports.editMenuItem = async (req, res) => {
  try {
    const { title,  } = req.body;
    const menuItem = await OrangeNavbar.findByIdAndUpdate(
      req.params.id,
      { title,  },
      { new: true }
    );
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the menu item' });
  }
};


// Update a menu item by ID
exports.updateMenuItem = async (req, res) => {
    try {
      const { title,  } = req.body;
      const menuItem = await OrangeNavbar.findByIdAndUpdate(
        req.params.id,
        { title, },
        { new: true }
      );
  
      if (!menuItem) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
  
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the menu item' });
    }
  };

// Delete a menu item by ID
exports.deleteMenuItem = async (req, res) => {
  try {
    await OrangeNavbar.findByIdAndRemove(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the menu item' });
  }
};
