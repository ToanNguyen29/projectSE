const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, 'Must have a review']
    },
    image: String,
    createAt: {
      type: Date,
      default: Date.now
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Must have a post']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Must have a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'post'
  }).populate({
    path: 'user'
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
