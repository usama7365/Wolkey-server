const Image = require("../models/image model/image.model");
const User = require("../models/users.model");

exports.postImage = async (req, res) => {
    const { userId } = req.user;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const displayName = user.displayName;
  
      const imagePath = req.files.map((file) => file.path);
  
      const image = new Image({ userId, displayName, imagePath });
  
      await image.save();
  
      const postId = req.body.postId;

      console.log("Received postId:", postId);

  
      user.postId = postId;
  
      await user.save();
  
      res.status(201).json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      res
        .status(500)
        .json({ error: "An error occurred while uploading the image" });
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
