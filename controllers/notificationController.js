const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const Notification = require('../models/NotificationSchema');
const factory = require('./handlerFactory');

exports.setNotificationOfUser = (req, res, next) => {
  req.query.userTo = req.user._id;
  next();
};

exports.getAllNotification = factory.getAll(Notification, {
  path: 'userTo userFrom'
});

exports.markAsAllOpened = catchAsync(async (req, res, next) => {
  const update = await Notification.updateMany(
    { userTo: req.user._id },
    { opened: true },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: { update }
  });
});
exports.markAsOpened = factory.updateOne(Notification);
