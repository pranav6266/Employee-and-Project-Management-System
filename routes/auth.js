// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');


// --- SIGNUP/REGISTER ---
// Display signup form (GET) - You'll create an EJS file for this
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

// Handle signup form submission (POST)
router.post('/signup', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
            // The role defaults to 'user' as per your schema
        });

        await user.save();
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
});

// --- LOGIN ---
// Display login form (GET)
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Handle login form submission (POST)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // Check if user exists and if password is correct
        if (user && await bcrypt.compare(req.body.password, user.password)) {

            // Create a session object
            req.session.user = {
                id: user._id,
                name: user.name,
                role: user.role
            };

            // Redirect based on role
            if (user.role === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/users/dashboard');
            }
        } else {
            return res.status(400).send('Invalid email or password.');
        }
    } catch (error) {
        res.status(500).send(`Error logging in: ${error}`);
    }
});

// --- LOGOUT ---
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send(`the error is : ${err}`);
            return res.redirect('/login'); // Or handle the error appropriately
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        res.redirect('/login');
    });
});


module.exports = router;