const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const TransactionType = require('../../models/TransactionType');
const User = require('../../models/User');

// @route   POST api/transaction-type
// @desc    Add a new transaction type
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const newType = new TransactionType({name : req.body.name});

        const type = await newType.save();

        res.json(type);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/transaction-type
//Get all types
//Access is private

router.get('/all', auth, async (req, res) => {
    try {
        const types = await TransactionType.find();
        res.json(types);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;