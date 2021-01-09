const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route GET api/auth/user
//Get logged in user
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/auth/login
//Authenticate User and get token
router.post(
  '/login',
  [
    check('email', 'Please include a valid Email').isEmail(),
    check('email', 'Email is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      let accessToken = jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 1200 }
      );
      let refreshToken = jwt.sign(
        payload,
        config.get('refreshToken'),
        { expiresIn: "30d" }
      );
      res.json({accessToken, refreshToken});
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route POST api/auth/refresh-token
//Refresh token
router.post(
  '/refresh-token',
  async (req, res) => {

    const { token } = req.body;

    if (!token) {
      return res.status(403).json({ error: "Access denied,token is missing." });
    }
      try {
        const payload = jwt.verify(token, config.get('refreshToken'));
        const user = {
          user: {
            id: payload.user.id,
          },
        };
        let accessToken = jwt.sign(
          user,
          config.get('jwtToken'),
          { expiresIn: 1200 }
        );
        res.json({accessToken});
      } catch (error) {
        res.json(error);
      }   
  }
);

//@route POST api/auth/register
//Register User
router.post(
  '/register',
  [
    check('name', 'Please enter a Name').exists(),
    check('email', 'Please include a valid Email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route PATCH api/auth/change-password
//Change Password
router.patch('/change-password', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid old password' }] });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        errors: [{ msg: 'Please enter a password with 6 or more characters' }],
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        errors: [{ msg: 'Your old password cannot be the new password' }],
      });
    }

    const salt = await bcrypt.genSalt(10);

    const pwd = await bcrypt.hash(newPassword, salt);

    updatePassword = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { password: pwd } },
      { runValidators: true }
    );

    res.json('Password changed successfully!');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

//@route POST api/auth/forgot-password
//Forgot Password
router.post('/forgot-password', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const token = jwt.sign({ user }, config.get('jwtToken'), {
      expiresIn: 3600,
    });

    var transport = nodemailer.createTransport({
      host: config.get('mailHost'),
      port: 2525,
      auth: {
        user: config.get('mailUser'),
        pass: config.get('mailPassword'),
      },
    });

    var mailOptions = {
      from: 'expense-tracker@gmail.com',
      to: user.email,
      subject: 'Reset password',
      html:
        '<h4><b>Reset Password</b></h4>' +
        '<p>Click on this link to reset your password:</p>' +
        '<a href=' +
        config.baseURL +
        'api/auth/reset/' +
        user._id +
        '/' +
        token +
        '">' +
        config.baseURL +
        'api/auth/reset/' +
        user._id +
        '/' +
        token +
        '</a>' +
        '<br><br>',
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json(
      'A mail has been sent to ' + user.email + ' with further instructions.'
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/auth/reset/:userId/:token
//Reset Password
router.post('/reset/:userId/:token', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    jwt.verify(req.params.token, config.get('jwtToken'), (err) => {
      if (err) {
        return res.status(401).send('Link has expired');
      }
    });

    const { newPassword, repeatPassword } = req.body;

    if (newPassword == undefined || newPassword.length < 6) {
      return res.status(400).json({
        errors: [{ msg: 'Please enter a password with 6 or more characters' }],
      });
    }
    if (repeatPassword !== newPassword) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'The passwords do not match' }] });
    }

    const salt = await bcrypt.genSalt(10);

    const pwd = await bcrypt.hash(newPassword, salt);

    updatePassword = await User.findOneAndUpdate(
      { _id: user.id },
      { $set: { password: pwd } },
      { runValidators: true }
    );

    res.json('Password successfully changed!');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;
