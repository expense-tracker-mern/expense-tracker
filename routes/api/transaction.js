const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Transaction = require('../../models/Transaction');
const User = require('../../models/User');

// @route   POST api/transactions/transaction
// @desc    Add a new transaction
// @access  Private
router.post('/transaction', auth, async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;

    if (date === null) {
      date = new Date();
    }

    const transactionFields = {};
    transactionFields.name = name;
    transactionFields.amount = amount;
    transactionFields.type = type;
    transactionFields.date = date;

    const transaction = new Transaction(transactionFields);
    await transaction.save();

    res.json(transaction);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/transactions/transaction
// @desc    Edit an existing transaction
// @access  Private
router.put('/transaction/', auth, async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;

    if (date === null) {
      date = new Date();
    }

    const transactionFields = {};
    transactionFields.name = name;
    transactionFields.amount = amount;
    transactionFields.type = type;
    transactionFields.date = date;

    let transaction = await Transaction.findById(req.user.id);

    if (!transaction) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
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
router.get('/alltransactions', auth, async (req, res) => {
  try {
    let records = await Transaction.find().where('user').equals(req.user.id);

    res.json(records);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
