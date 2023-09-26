const Registration = require('../../../models/AdminModels/Registration.model');

// Create Agency Registration
exports.createAgencyRegistration = async (req, res) => {
    try {
      const { title, features, buttons } = req.body;
      const registration = new Registration({ title, features, buttons });
      await registration.save();
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating agency registration' });
    }
  };



// Get all Agency Registrations
exports.getAllAgencyRegistrations = async (req, res) => {
    try {
      const AgencyRegistrations = await Registration.find();
      res.json(AgencyRegistrations);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching Agency registrations' });
    }
  };
  
  // Get Agency Registration by ID
  exports.getAgencyRegistrationById = async (req, res) => {
    try {
      const registration = await Registration.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Agency registration not found' });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching Agency registration' });
    }
  };
  
  // Update Agency Registration by ID
  exports.updateAgencyRegistration = async (req, res) => {
    try {
      const { title, features, buttons } = req.body;
      const registration = await Registration.findByIdAndUpdate(
        req.params.id,
        { title, features, buttons },
        { new: true }
      );
  
      if (!registration) {
        return res.status(404).json({ error: 'Agency registration not found' });
      }
  
      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating Agency registration' });
    }
  };
  
  // Delete Agency Registration by ID
  exports.deleteAgencyRegistration = async (req, res) => {
    try {
      const registration = await Registration.findByIdAndRemove(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Agency registration not found' });
      }
      res.json({ message: 'Agency registration deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting Agency registration' });
    }
  };
  



