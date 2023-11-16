const express = require('express');
const authController = require('../controllers/authController.js');
const commentController = require('./../controllers/commentController.js');

const router = express.Router({ mergeParams: true });

router
  // authController.protect,
  .route('/')
  .get(commentController.getAllComment)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    commentController.setUserAndPost,
    commentController.createComment
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    commentController.getComment
  )
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    // commentController.checkUser,
    commentController.updateComment
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    // commentController.checkUser,
    commentController.deleteComment
  );

module.exports = router;
