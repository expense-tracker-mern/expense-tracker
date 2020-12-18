const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
var dateFormat = require("dateformat");

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

// @route   GET api/transactions/all-transactions/:type/:date
// @desc    Retrieve all transactions for a user by month or year
// @access  Private
router.get('/all-transactions/:type/:date', auth, async (req, res) => {
  var dateType = {};
  if (req.params.type === 'month') {
    dateType = {
      format: "%m-%Y",
      date: "$date"
    }
  }else{
    dateType = {
      format: "%Y",
      date: "$date"
    }
  }
  try {
    let records = await Transaction.aggregate([
      {
        $project: {
          _id: "$_id",
          category: "$category",
          user: "$user",
          type: "$type",
          date: "$date",
          amount: "$amount",
          timeCriteria: {
            $dateToString: dateType
          },
        }
      },
      {
        $match: {
          timeCriteria: {
            $eq: req.params.date
          }
        }
      },
      {
        $project: {
          _id: "$_id",
          category: "$category",
          date: "$date",
          user: "$user",
          type: "$type",
          amount: "$amount"
        }
      },
      { $sort: { date: -1 } },
    ]);

    let a = await Transaction
      .populate(records, [{ path: "user" }, { path: "category" }, { path: "type" }]);

    res.json(a);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
