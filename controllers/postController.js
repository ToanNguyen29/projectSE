const Post = require('./../models/PostSchema');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('./../models/UserSchema');

exports.setUser = (req, res, next) => {
  if (!req.body.postedBy) {
    req.body.postedBy = req.user._id;
  }
  next();
};

exports.setPostOfMe = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const post = await Post.find({
    postedBy: req.user._id,
    replyTo: { $exists: false }
  })
    .populate('postedBy')
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    quantity: post.length,
    data: { post }
  });
});

exports.setReplyOfMe = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const post = await Post.find({
    postedBy: req.user._id,
    replyTo: { $exists: true }
  })
    .populate('postedBy')
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    quantity: post.length,
    data: { post }
  });
});

exports.setImage = (req, res, next) => {
  if (req.files) {
    const media = req.files.map((file) => ({ filename: file.filename }));
    req.body.image = media;
  } else if (req.file) {
    const media = { filename: req.file.filename };
    req.body.image = media;
  }

  next();
};

exports.checkPostedBy = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new appError('Do not exist this post', 404));
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    return next(
      new appError('You do not have permission to manipulate that post', 403)
    );
  }
  next();
});

exports.setReplyData = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new appError('Do not exist this post', 404));
  }
  req.body.replyTo = req.params.id;
  next();
});

exports.getAllPostFollowing = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 200;
  const skip = (page - 1) * limit;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new appError('Do not exist this user', 404));
  }

  const posts = await Post.find({ postedBy: { $in: user.following } })
    .sort('-createdAt')
    .limit(limit)
    .skip(skip);
  res.status(200).json({
    status: 'success',
    quantity: posts.length,
    data: { posts }
  });
});

exports.getAllPosts = factory.getAll(Post, { path: 'postedBy' });
exports.getPost = factory.getOne(Post, { path: 'postedBy replyTo' });
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

exports.like = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const isLiked = req.user.likes && req.user.likes.includes(postId);

  const option = isLiked ? '$pull' : '$addToSet';

  // Insert user like
  await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  );

  // Insert post like
  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  );

  const check = !isLiked;

  res.status(200).json({
    status: 'success',
    data: { post },
    check: { check }
  });
});

exports.checkLike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const isLiked = req.user.likes && req.user.likes.includes(postId);

  res.status(200).json({
    status: 'success',
    data: { isLiked }
  });
});

exports.checkRetweet = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const retweet = await Post.findOne({
    postedBy: userId,
    retweetData: postId
  });

  const isRetweet = retweet ? true : false;

  res.status(200).json({
    status: 'success',
    data: { isRetweet }
  });
});

exports.retweet = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  // Try and delete retweet
  const deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId
  });

  const option = deletedPost != null ? '$pull' : '$addToSet';

  let repost = deletedPost;

  if (repost == null) {
    repost = await Post.create({ postedBy: userId, retweetData: postId });
  }

  await User.findByIdAndUpdate(
    userId,
    { [option]: { retweets: repost._id } },
    { new: true }
  );

  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { retweetUsers: userId } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});
