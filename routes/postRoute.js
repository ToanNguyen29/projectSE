const express = require('express');
const router = express.Router();
const postController = require(`./../controllers/postController.js`);
const authController = require('../controllers/authController.js');
const imageMiddleware = require('./../controllers/imageMiddleware.js');

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    imageMiddleware.array('image', 5),
    postController.setUser,
    postController.setImage,
    postController.createPost
  );

router.use(authController.protect, authController.restrictTo('user'));
router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    postController.checkPostedBy,
    imageMiddleware.array('image', 5),
    postController.setImage,
    postController.updatePost
  )
  .delete(postController.checkPostedBy, postController.deletePost);

router
  .route('/:id/like')
  .put(postController.like)
  .get(postController.checkLike);

router.route('/:id/retweet').put(postController.retweet);
router
  .route('/:id/reply')
  .put(
    postController.setUser,
    postController.setReplyData,
    postController.createPost
  );

module.exports = router;
