const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

exports.handleNudeImage = catchAsync(async (req, res, next) => {
  const response = await axios.post(
    'http://localhost:8000/api/v1/validateImage',
    req.file.buffer,
    {
      headers: {
        'Content-Type': 'image/*'
      }
    }
  );

  if (response.data.message === 1) {
    next();
  } else {
    res.status(200).json({
      message: 'Your photo does not meet community standards'
    });
  }
});

exports.handleNudeImage = catchAsync(async (req, res, next) => {
  const response = await axios.post(
    'http://localhost:8000/api/v1/generateAI',
    req.file.buffer,
    {
      headers: {
        'Content-Type': 'image/*'
      }
    }
  );
});
