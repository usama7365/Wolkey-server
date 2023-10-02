const MetaTag = require("../../models/AdminModels/metaTags.model");

exports.createMetaTags = async (req, res) => {
  try {
    const { title, description, keywords } = req.body;
    const metaTag = new MetaTag({
      title,
      description,
      keywords,
    });
    const savedMetaTag = await metaTag.save();
    res.json(savedMetaTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.viewAllMetaTags = async (req, res) => {
    try {
      // Fetch all meta tags from the database
      const allMetaTags = await MetaTag.find();
  
      // Check if there are no meta tags
      if (!allMetaTags || allMetaTags.length === 0) {
        return res.status(404).json({ error: "No meta tags found" });
      }
  
      // Send the retrieved meta tags as a response
      res.json(allMetaTags);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  // Delete a meta tag by ID
exports.deleteMetaTags = async (req, res) => {
    try {
      const metaTagId = req.params.id;
  
      // Check if the provided ID is valid
      if (!metaTagId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid meta tag ID format" });
      }
  
      // Attempt to delete the meta tag by ID
      const deletedMetaTag = await MetaTag.findByIdAndDelete(metaTagId);
  
      if (!deletedMetaTag) {
        return res.status(404).json({ error: "Meta tag not found" });
      }
  
      res.json({ message: "Meta tag deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };