const express = require('express');
const authController = require('../controllers/authController.js');
const notificationCotroller = require('./../controllers/notificationController.js');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .get(
    notificationCotroller.setNotificationOfUser,
    notificationCotroller.getAllNotification
  );

router.route('/:id/markAsOpened').patch(notificationCotroller.markAsOpened);
router.route('/markAsAllOpened').patch(notificationCotroller.markAsAllOpened);

module.exports = router;
