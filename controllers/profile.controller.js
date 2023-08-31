const Profile = require('../models/profile.model');
const User = require('../models/users.model');
const City = require('../models/cities.model'); 

exports.createProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      availability,
      pricing,
      subject,
      personalDetails,
      video,
      photos,
    } = req.body;

    const userId = req.user.userId;
    console.log('Logged-in user ID:', userId);

    // Check if the user already has a profile
    const user = await User.findById(userId);
    if (user.profileId) {
      console.log('Profile already exists for this user');
      return res.status(400).json({ error: 'Profile already exists for this user' });
    }

    // Create a new profile with the userId included
    const profile = new Profile({
      userId,
      name,
      title,
      availability,
      pricing,
      subject,
      personalDetails,
      video,
      photos: Array.isArray(photos) ? photos : [photos],
    });

    await profile.save();

    user.profileId = profile._id;
    await user.save();

    console.log('Profile created successfully');
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'An error occurred while creating the profile' });
  }
};








exports.getProfileById = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    console.log('Logged-in user ID:', loggedInUserId);

    const user = await User.findById(loggedInUserId);
    if (!user.profileId) {
      return res.status(404).json({ error: 'Profile not found for this user' });
    }

    const profile = await Profile.findById(user.profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the profile' });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const citiesDocument = await City.findOne({}, 'name'); 
    if (citiesDocument) {
      res.json(citiesDocument.name); 
    } else {
      res.status(404).json({ message: 'No cities found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching cities.' });
  }
};




// exports.viewOtherProfiles = async (req, res) => {
//   try {
//     const loggedInUserId = req.user.userId;

//     // Find profiles that do not belong to the logged-in user
//     const otherProfiles = await Profile.find({ _id: { $ne: loggedInUserId } });

//     res.status(200).json(otherProfiles);
//   } catch (error) {
//     console.error('Error viewing other profiles:', error);
//     res.status(500).json({ error: 'An error occurred while viewing other profiles' });
//   }
// };
