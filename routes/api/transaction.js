const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Transaction = require('../../models/Transaction');
const User = require('../../models/User');

// @route   POST api/transaction
// @desc    Add a new transaction
// @access  Private
router.post('/', auth, [
  check('category', 'Category is required')
    .exists(),
  check('type', 'Type is required')
    .exists(),
  check('amount', 'Amount is required')
    .exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { category, amount, type, date } = req.body;

    if (date === null) {
      date = new Date();
    }

    const transactionFields = {};
    transactionFields.category = category;
    transactionFields.amount = amount;
    transactionFields.type = type;
    transactionFields.date = date;
    transactionFields.user = req.user.id;

    const transaction = new Transaction(transactionFields);
    await transaction.save();

    res.json(transaction);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// @route   PUT api/transaction
// @desc    Edit an existing transaction
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const { category, amount, type, date } = req.body;

    if (date === null) {
      date = new Date();
    }

    const transactionFields = {};
    transactionFields.category = category;
    transactionFields.amount = amount;
    transactionFields.type = type;
    transactionFields.date = date;

    let transaction = await Transaction.findById(req.user.id);

    if (!transaction) {
      return res.status(400).json({ msg: 'There is no transaction for this user' });
    }

    transaction = await Transaction.findOneAndUpdate(
      { _id: req.user.id },
      { $set: transactionFields },
      { new: true }
    );

    return res.json(transaction);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/transactions/transaction
// @desc    Delete an existing transaction
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.user.id);

    res.json({ msg: 'Transaction Deleted!' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/alltransactions
// @desc    Retrieve all transactions for a user
// @access  Private
router.get('/all-transactions', auth, async (req, res) => {
  try {
    let records = await Transaction.find()
    .where('user')
    .equals(req.user.id)
    .populate('user')
    .populate('category')
    .populate('type');

    res.json(records);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
