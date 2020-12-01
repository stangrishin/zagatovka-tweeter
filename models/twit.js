const mongoose = require('mongoose');

const TwitsSchema = mongoose.Schema({
  img: String,
  dateCreate: Date,
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  authorName: String,
  content: String,
  likes: Array,

});

module.exports = mongoose.model('Twits', TwitsSchema);
