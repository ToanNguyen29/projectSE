const express = require('express');
const authController = require('../controllers/authController.js');
const chatController = require('./../controllers/chatController.js');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));
router
  // authController.protect,
  .route('/')
  .get(chatController.getAllChat)
  .post(chatController.editReqBody, chatController.createChat);
router
  .route('/:id')
  .get(chatController.getChat)
  .patch(chatController.updateChat);
// .delete(chatController.checkAdmin, chatController.deleteComment);

module.exports = router;
