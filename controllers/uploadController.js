const cloudinary = require('../utils/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'digital-agency',
      resource_type: 'image',
    });
    res.json({ url: uploadRes.secure_url, public_id: uploadRes.public_id });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', err });
  }
};
