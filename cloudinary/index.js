const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_SECRET,
    api_key: process.env.CLOUDINARY_KEY,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Camping site',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

module.exports = {
    cloudinary,
    storage
}