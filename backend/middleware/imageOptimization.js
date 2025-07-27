// backend/middleware/imageOptimization.js
const sharp = require('sharp');
const fs = require('fs');

module.exports = async function optimizeImage(req, res, next) {
  if (!req.file || !req.file.path || !req.file.mimetype.startsWith('image/')) {
    return next();
  }

  try {
    const buffer = await sharp(req.file.path)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();
    await fs.promises.writeFile(req.file.path, buffer);
    next();
  } catch (err) {
    console.error('Image optimization error:', err);
    next(err);
  }
};
