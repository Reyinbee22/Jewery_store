const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET  
})

// cloudinary.config({
//     cloud_name: "dvumaom62",
//     api_key: "547778533219116",
//     api_secret: "Jutto3JTrexNu3miiUAqOW1UIlU"  
// })
module.exports = cloudinary