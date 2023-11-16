const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const Comment = require('./../models/CommentSchema');
const factory = require('./handlerFactory');
const User = require('./../models/UserSchema');

exports.getAllComment = factory.getAll(Comment);

exports.setUserAndPost = catchAsync(async (req, res, next) => {
  if (!req.body.post) {
    req.body.post = req.params.postId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
});

// exports.checkUser = catchAsync(async (req, res, next) => {
//   const comment = await Comment.findById(req.params.id);

//   if (!comment) {
//     return next(new appError('Do not exist this comment', 404));
//   }

//   if (comment.user !== req.user._id) {
//     return next(new appError('No permission handle this comment', 401));
//   }

//   next();
// });

exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
