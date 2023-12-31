const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userTo: { type: Schema.Types.ObjectId, ref: 'User' },
    userFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    notificationType: String,
    opened: { type: Boolean, default: false },
    entityId: Schema.Types.ObjectId
  },
  { timestamps: true }
);

NotificationSchema.statics.insertNotification = async (
  userTo,
  userFrom,
  notificationType,
  entityId
) => {
  const data = {
    userTo: userTo,
    userFrom: userFrom,
    notificationType: notificationType,
    entityId: entityId
  };
  await Notification.deleteOne(data).catch((error) => console.log(error));
  const newNotification = await Notification.create(data).catch((error) =>
    console.log(error)
  );
  return newNotification;
};

var Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
