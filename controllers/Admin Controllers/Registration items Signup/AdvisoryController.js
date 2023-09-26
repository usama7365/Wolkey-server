const Registration = require('../../../models/AdminModels/Registration.model');

// Create Advisory Registration
exports.createAdvisoryRegistration = async (req, res) => {
    try {
      const { title, features, buttons } = req.body;
      const registration = new Registration({ title, features, buttons });
      await registration.save();
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating advisory registration' });
    }
  };

  
// Get all Advisory Registrations
exports.getAllAdvisoryRegistrations = async (req, res) => {
    try {
      const AdvisoryRegistrations = await Registration.find();
      res.json(AdvisoryRegistrations);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching Advisory registrations' });
    }
  };
  
  // Get Advisory Registration by ID
  exports.getAdvisoryRegistrationById = async (req, res) => {
    try {
      const registration = await Registration.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Advisory registration not found' });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching Advisory registration' });
    }
  };
  
  // Update Advisory Registration by ID
  exports.updateAdvisoryRegistration = async (req, res) => {
    try {
      const { title, features, buttons } = req.body;
      const registration = await Registration.findByIdAndUpdate(
        req.params.id,
        { title, features, buttons },
        { new: true }
      );
  
      if (!registration) {
        return res.status(404).json({ error: 'Advisory registration not found' });
      }
  
      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating Advisory registration' });
    }
  };
  
  // Delete Advisory Registration by ID
  exports.deleteAdvisoryRegistration = async (req, res) => {
    try {
      const registration = await Registration.findByIdAndRemove(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Advisory registration not found' });
      }
      res.json({ message: 'Advisory registration deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting Advisory registration' });
    }
  };
  

