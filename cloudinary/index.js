const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require('multer');
cloudinary.config({
    cloud_name:process.env.CloudName,
    api_key:process.env.apiKey,
    api_secret:process.env.apiSecret
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
folder: 'yelpCamp',
    allowedFormats: ['png','jpg','jpeg'] 
  }
});
module.exports={cloudinary,storage};