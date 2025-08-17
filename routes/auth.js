// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const crypto = require('crypto');

// --- FORGOT PASSWORD ROUTES ---

// Display the forgot password form
router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password');
});

// Handle the forgot password form submission
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // To prevent email enumeration, show a generic message
            return res.render('auth/forgot-password', { message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Generate a token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // SIMULATE SENDING EMAIL: Log the link to the console
        console.log('--- PASSWORD RESET LINK ---');
        console.log(`http://${req.headers.host}/reset/${token}`);
        console.log('---------------------------');

        res.render('auth/forgot-password', { message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        res.status(500).send('Error processing request.');
    }
});

// Display the reset password form
router.get('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        res.render('auth/reset-password', { token: req.params.token });
    } catch (error) {
        res.status(500).send('Error displaying reset page.');
    }
});

// Handle the reset password form submission
router.post('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.render('auth/reset-password', { token: req.params.token, error: 'Passwords do not match.' });
        }

        // Update password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Redirect to login
        res.redirect('/login');

    } catch (error) {
        res.status(500).send('Error resetting password.');
    }
});

// --- SIGNUP/REGISTER ---
// Display signup form (GET) - You'll create an EJS file for this
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

// Handle signup form submission (POST)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // --- Start Validation ---
        if (!name || !email || !password) {
            return res.render('auth/signup', { error: 'All fields are required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('auth/signup', { error: 'Please enter a valid email address.' });
        }

        if (password.length < 8) {
            return res.render('auth/signup', { error: 'Password must be at least 8 characters long.' });
        }
        // --- End Validation ---

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.render('auth/signup', { error: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.redirect('/login');
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
            return res.render('auth/login', {
                error: 'Invalid email or password.'
            });
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