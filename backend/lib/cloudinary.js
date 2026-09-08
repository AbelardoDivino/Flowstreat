const cloudinary = require('cloudinary').v2;
const env = require('../config/env');

if (env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

async function uploadImage(buffer, folder = 'flowstreat') {
  if (!env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME === 'pendente') {
    // modo dev sem cloudinary - retorna placeholder
    return 'https://via.placeholder.com/600';
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadImage };
