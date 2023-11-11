const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
