const User = require('./../models/UserSchema');
const Chat = require('./../models/ChatSchema');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllChat = factory.getAll(Chat, { path: 'latestMessage' });

exports.getChat = factory.getOne(Chat);

exports.editReqBody = catchAsync(async (req, res, next) => {
  if (!req.body.users) {
    return next(new appError('Users param not sent with request', 400));
  }
  const users = req.body.users;
  if (users.length === 0) {
    return next(new appError('Users array is empty', 400));
  }
  users.push(req.user._id);
  req.body.users = users;
  next();
});
exports.createChat = factory.createOne(Chat);

exports.updateChat = catchAsync(async (req, res, next) => {});

exports.checkAdmin = catchAsync(async (req, res, next) => {});

exports.deleteChat = catchAsync(async (req, res, next) => {});
