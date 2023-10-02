const GreenNavbar = require('../../models/AdminModels/GreenNavbar.model');

// Create a new menu item for the green navbar
exports.createGreenMenuItem = async (req, res) => {
  try {
    const { title, link } = req.body;

    // Check if there are already 2 items in the database
    const itemCount = await GreenNavbar.countDocuments();
    if (itemCount >= 2) {
      return res.status(400).json({ error: 'You can only create up to 2 items.' });
    }

    const menuItem = new GreenNavbar({ title, link });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the menu item' });
  }
};


// Get all menu items for the green navbar
exports.getAllGreenMenuItems = async (req, res) => {
  try {
    const menuItems = await GreenNavbar.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching menu items' });
  }
};

// Edit a menu item for the green navbar by ID
exports.editGreenMenuItem = async (req, res) => {
  try {
    const { title, link } = req.body;
    const menuItem = await GreenNavbar.findByIdAndUpdate(
      req.params.id,
      { title, link },
      { new: true }
    );
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the menu item' });
  }
};

// Delete a menu item for the green navbar by ID
exports.deleteGreenMenuItem = async (req, res) => {
  try {
    await GreenNavbar.findByIdAndRemove(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the menu item' });
  }
};
