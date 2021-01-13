const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid').v4;

const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const Category = require('../../models/Category');
const TransactionType = require('../../models/TransactionType');


// @route   POST api/transaction
// @desc    Add a new transaction
// @access  Private
router.post(
  '/',
  auth,
  async (req, res) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, "uploads");
      },
      filename: (req, file, cb) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          cb(null, uuid() + '-' + fileName)
      }
    });
    
    var upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
          if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
              cb(null, true);
          } else {
              cb(null, false);
              req.fileValidationError = "Only .png, .jpg, .jpeg and .pdf formats allowed";
          }
      },
    }).single('file');
    
    upload(req, res, async function (err) {
      let { name, category, amount, type, date } = req.body;
      let errors = [];
      if(req.fileValidationError){
        errors.push(req.fileValidationError);
      }
      if(category === undefined) {
        errors.push('Category is required')
      }
      if(amount === undefined) {
        errors.push('Amount is required')
      }
      if(type === undefined) {
        errors.push('Type is required')
      }
      if(errors.length > 0){
        return res.status(400).json({ errors: errors });
      }
      if (err instanceof multer.MulterError) {
        return res.status(500).json({errors: 'Unable to upload File'});
      } else if (err) {
        return res.status(500).json({errors: 'Unable to upload File'});
      }
      try {
        const categoryObject = await Category.findOne({ name: category });
        const typeObject = await TransactionType.findOne({ name: type });
  
        if (date === undefined) {
          date = new Date();
        }
  
        if (name === undefined) {
          name = category + '_' + type + '_' + date;
        }
  
        const transaction = new Transaction({
          category : categoryObject.id,
          amount : amount,
          type : typeObject.id,
          date : date,
          user : req.user.id,
          name : name,
          file: {
            originalName : req.file ? req.file.originalname : null,
            fileName : req.file ? req.file.filename : null,
            path : req.file ? req.file.path : null
          }
        });
        await transaction.save();
  
        res.json(transaction);
      } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      }
    });
  }
);

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
      return res
        .status(400)
        .json({ msg: 'There is no transaction for this user' });
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
  const user = await User.findById(req.user.id).select('-password');
  var dateType = {};
  if (req.params.type === 'month') {
    dateType = {
      format: '%m-%Y',
      date: '$date',
    };
  } else {
    dateType = {
      format: '%Y',
      date: '$date',
    };
  }
  try {
    let records = await Transaction.aggregate([
      { $match: { user: user._id } },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          category: '$category',
          user: '$user',
          type: '$type',
          date: '$date',
          amount: '$amount',
          timeCriteria: {
            $dateToString: dateType,
          },
          file: '$file',
        },
      },
      {
        $match: {
          timeCriteria: {
            $eq: req.params.date,
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          category: '$category',
          date: '$date',
          user: '$user',
          type: '$type',
          amount: '$amount',
          file: '$file',
        },
      },
      { $sort: { date: -1 } },
    ]);

    let a = await Transaction.populate(records, [
      { path: 'user' },
      { path: 'category' },
      { path: 'type' },
    ]);

    res.json(a);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// // @route   POST api/transaction
// // @desc    Add a new transaction
// // @access  Private
// router.post('/file/:id', auth, async (req, res) => {
//   var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads');
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
//     },
//   });

//   var upload = multer({ storage: storage, limits: 5000000 }).single('file');

//   upload(req, res, async function (err) {
//     if (err instanceof multer.MulterError) {
//       console.log('Multer', err);
//       return res.status(500).json(err);
//     } else if (err) {
//       console.log('err', err);
//       return res.status(500).json(err);
//     }

//     let transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       fs.unlink(req.file.path, (err) => {
//         if (err) {
//           console.log(err);
//         }
//       });
//       return res
//         .status(400)
//         .json({ msg: 'There is no transaction for this user' });
//     }
//     const uploadFile = req.file;
//     let fileDetails = { file: {} };
//     fileDetails.file.originalName = uploadFile.originalname;
//     fileDetails.file.fileName = uploadFile.filename;
//     fileDetails.file.path = uploadFile.path;

//     transaction = await Transaction.findOneAndUpdate(
//       { _id: req.params.id },
//       { $set: fileDetails },
//       { new: true }
//     );

//     return res.status(200).send(req.file);
//   });
// });

// // @route   POST api/transaction
// // @desc    Add a new transaction
// // @access  Private
// router.get('/file/:id', auth, async (req, res) => {
//   try {
//     let transaction = await Transaction.findById(req.params.id);

//     const filePath = transaction.file.path;
//     const fileOriginalName = transaction.file.originalName;

//     res.sendFile(path.join(__dirname, '../..', filePath));
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

module.exports = router;
