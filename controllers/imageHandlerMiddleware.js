const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const FormData = require('form-data');

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
      return res.status(200).json({
        message: 'Your photo does not meet community standards'
      });
    }
  }
  console.log('111111111111111111111');
  // Tất cả các hình ảnh đều thỏa mãn yêu cầu, chuyển sang middleware tiếp theo
  next();
});
