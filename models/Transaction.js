const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: TextTrackCue,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);
