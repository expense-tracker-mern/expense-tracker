const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route GET api/auth/user
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
router.post('/login', [
    check('email', 'Please include a valid Email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
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
                    id: user.id
                }
            }

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
    });

//@route POST api/auth/register
//Register User
router.post('/register', [
    check('email', 'Please include a valid Email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({
            min: 6
        })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            user = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            res.json({ msg: "User saved successfully!" });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });

//@route PATCH api/auth/change-password
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

        if(newPassword.length < 6){
            return res
                .status(400)
                .json({ errors: [{ msg: 'Please enter a password with 6 or more characters' }] });
        }

        const salt = await bcrypt.genSalt(10);

        const pwd = await bcrypt.hash(newPassword, salt);

            updatePassword = await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: {password: pwd} },
                { runValidators: true },
            );

        res.json("Password changed successfully!");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = router;