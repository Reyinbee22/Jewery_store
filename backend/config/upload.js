const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a JPG or PNG file.'), false);
    }
  };

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;