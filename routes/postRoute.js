const express = require('express');
const router = express.Router();
const postController = require(`./../controllers/postController.js`);
const authController = require('../controllers/authController.js');
const commentRouter = require('./commentRoute.js');

// router.param('id', tourController.checkID);

router.use('/:postId/comments', commentRouter);

router
  // authController.protect,
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    postController.createPost
  );
router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    postController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    postController.deletePost
  );

router.use(authController.protect, authController.restrictTo('user'));
router.route('/:id/like').put(postController.like);
router.route('/:id/retweet').put(postController.retweet);

module.exports = router;
