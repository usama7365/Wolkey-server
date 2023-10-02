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
