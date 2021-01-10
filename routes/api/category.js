const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Category = require('../../models/Category');
const TransactionType = require('../../models/TransactionType');
const User = require('../../models/User');

// @route   POST api/category
// @desc    Add a new category
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      type: req.body.type,
    });

    const category = await newCategory.save();

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error ' + err.message);
  }
});

//@route GET api/category/:type
//Get categories by type
//Access is private

router.get('/:type', auth, async (req, res) => {
  try {
    const transactionType = await TransactionType.findOne({
      name: req.params.type,
    });
    const categories = await Category.find({ type: transactionType._id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
