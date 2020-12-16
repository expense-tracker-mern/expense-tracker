const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transactionType',
    required: true,
  },
});

module.exports = Category = mongoose.model('category', CategorySchema);
