const Message = require('../models/MessageSchema');
const User = require('../models/UserSchema');
const Chat = require('../models/ChatSchema');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.allMessages = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const messages = await Message.find({ chat: req.params.chatId })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'name profilePic email')
    .populate('chat');

  if (!messages) {
    return next(new appError('Do not exist Chat', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { messages }
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new appError('Invalid data passed into request', 404));
  }

  const chat = await Chat.findById(chatId).populate('users');

  if (!chat) {
    return next(new appError('Do not exist this chat', 404));
  }

  for (const userId of chat.users) {
    const user = await User.findById(userId);

    if (!user) {
      return next(new appError('Do not exist this user', 404));
    }

    if (
      user.blocking.includes(req.user._id) &&
      user._id.toString() !== req.user._id
    ) {
      return next(new appError('mầy bị block ròi thằng ngu', 404));
    }

    if (
      user.blockers.includes(req.user._id) &&
      user._id.toString() !== req.user._id
    ) {
      return next(
        new appError('mầy block người ta rồi mà nhắn tin để làm gì?', 404)
      );
    }
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  };

  let message = await Message.create(newMessage);

  message = await message
    .populate('sender', 'firstName lastName profilePic')
    .execPopulate();
  message = await message.populate('chat').execPopulate();
  message = await User.populate(message, {
    path: 'chat.users',
    select: 'name profilePic email'
  });

  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

  res.status(200).json({
    status: 'success',
    data: { message }
  });
});
