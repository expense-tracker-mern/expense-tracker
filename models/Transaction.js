const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transactionType',
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
  file: {
    originalName: {
      type: String,
    },
    fileName: {
      type: String,
    },
    path: {
      type: String,
    },
  },
});

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);
