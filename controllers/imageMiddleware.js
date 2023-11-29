const multer = require('multer');
const path = require('path');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']; // Add image extensions
const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv']; // Add video extensions
const fs = require('fs');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const FormData = require('form-data');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // Ensure the 'uploads' directory exists
      fs.mkdirSync('./uploads', { recursive: true });
      cb(null, path.join('./uploads'));
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();

  if (imageExtensions.includes(extname) || videoExtensions.includes(extname)) {
    return cb(null, true); // Accept the file
  }

  const error = new Error('File type not allowed.');
  error.code = 'LIMIT_FILE_TYPES';
  return cb(error, false);
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

exports.handleNudeImages = catchAsync(async (req, res, next) => {
  let images = [];

  if (req.files) {
    images = req.files;
  } else if (req.file) {
    images.push(req.file);
  }

  for (let i = 0; i < images.length; i++) {
    const fileData = fs.readFileSync(images[i].path);

    const formData = new FormData();
    formData.append('file', fileData, {
      filename: images[i].filename,
      contentType: images[i].mimetype
    });

    const response = await axios.post(
      'http://localhost:8000/api/v1/validateImage',
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    if (response.data.message === 1) {
      continue;
    } else {
      return res.status(400).json({
        message: 'Your photo does not meet community standards'
      });
    }
  }

  next();
});
