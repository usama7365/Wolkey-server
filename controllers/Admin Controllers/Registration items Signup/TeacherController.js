const Registration = require('../../../models/AdminModels/Registration.model');

// Create Teacher Registration
exports.createTeacherRegistration = async (req, res) => {
  try {
    const { title, features, buttons } = req.body;
    const registration = new Registration({ title, features, buttons });
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while creating teacher registration' });
  }
};

// Get all Teacher Registrations
exports.getAllTeacherRegistrations = async (req, res) => {
  try {
    const teacherRegistrations = await Registration.find();
    res.json(teacherRegistrations);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching teacher registrations' });
  }
};

// Get Teacher Registration by ID
exports.getTeacherRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Teacher registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching teacher registration' });
  }
};

// Update Teacher Registration by ID
exports.updateTeacherRegistration = async (req, res) => {
  try {
    const { title, features, buttons } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { title, features, buttons },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ error: 'Teacher registration not found' });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating teacher registration' });
  }
};

// Delete Teacher Registration by ID
exports.deleteTeacherRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndRemove(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Teacher registration not found' });
    }
    res.json({ message: 'Teacher registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting teacher registration' });
  }
};
