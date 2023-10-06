const Image = require("../models/image model/image.model");
const User = require("../models/users.model");

exports.postImage = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if there are any uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one image" });
    }

    const imagePaths = req.files.map((file) => file.path.replace('public\\', ''));

    // Create a separate post for each image
    for (const imagePath of imagePaths) {
      const image = new Image({ userId, imagePath });
      await image.save();
    }

    res.status(201).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the images" });
  }
};


exports.getUserImages = async (req, res) => {
  const { userId } = req.user;

  try {
    const userImages = await Image.find({ userId });
    res.status(200).json(userImages);
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ error: 'An error occurred while fetching user images' });
  }
};


exports.getAllUserImages = async (req, res) => {
  const { userId } = req.user;

  try {
    const userImages = await Image.find({ userId });
    const imagePaths = userImages.map((image) => image.imagePath.replace('public\\', ''));
    res.status(200).json({ userImages, imagePaths });
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ error: 'An error occurred while fetching user images' });
  }
};

exports.getUserGallery = async (req, res) => {
  const { userId } = req.params; // Use userId instead of profileId

  try {
    const userImages = await Image.find({ userId });
    res.status(200).json(userImages);
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ error: 'An error occurred while fetching user images' });
  }
};
