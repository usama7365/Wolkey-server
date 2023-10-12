const Image = require("../models/image model/image.model");
const User = require("../models/users.model");
const fs = require('fs'); // Required for file deletion
const path = require('path');

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

    const imagePaths = req.files.map((file) => `/uploads/images/${file.filename}`);

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


  exports.getImagesByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
      // Find images by user ID
      const images = await Image.find({ userId });

      if (!images) {
        return res.status(404).json({ error: "No images found for the user" });
      }

      res.status(200).json(images);
    } catch (error) {
      console.error("Error fetching images by user ID:", error);
      res.status(500).json({ error: "An error occurred while fetching images" });
    }
  };


  exports.deleteImageByUserId = async (req, res) => {
    const { userId } = req.user; 
    const { imageId } = req.params; 
  
    try {
      // Find the image by its ID
      const image = await Image.findOne({ _id: imageId });
  
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
  

      if (image.userId.toString() !== userId) {
        return res.status(403).json({ error: "You do not have permission to delete this image" });
      }
  
      fs.unlink(path.join('public', image.imagePath), async (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
          return res.status(500).json({ error: "An error occurred while deleting the image" });
        }
  
        // Delete the image from the database
        await image.remove();
        res.status(204).send();
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "An error occurred while deleting the image" });
    }
  };
