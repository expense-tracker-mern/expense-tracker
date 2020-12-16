const mongoose = require('mongoose');

const TransactionTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

module.exports = TransactionType = mongoose.model('transactionType', TransactionTypeSchema);
