const express = require('express');
const router = express.Router();
const postController = require(`./../controllers/postController.js`);
const authController = require('../controllers/authController.js');
const imageMiddleware = require('./../controllers/imageMiddleware.js');
// const imageHandlerMiddleware = require('./../controllers/imageMiddleware.js');

router.use(authController.protect, authController.restrictTo('user'));
router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    imageMiddleware.upload.array('image', 5),
    imageMiddleware.handleNudeImages,
    postController.setUser,
    postController.setImage,
    postController.createPost
  );

router.route('/postOfMe').get(postController.setPostOfMe);
router.route('/replyOfMe').get(postController.setReplyOfMe);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    postController.checkPostedBy,
    imageMiddleware.upload.array('image', 5),
    imageMiddleware.handleNudeImages,
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
