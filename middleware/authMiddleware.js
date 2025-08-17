// middleware/authMiddleware.js

// Checks if a user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is logged in, proceed to the next function
    }
    res.redirect('/login'); // If not logged in, redirect to login page
};

// Checks if the logged-in user is an Admin
const isAdmin = (req, res, next) => {
    // First, ensure the user is authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }
    // Then, check their role
    if (req.session.user.role === 'admin') {
        return next(); // User is an admin, proceed
    }
    // If they are not an admin, send a forbidden error
    res.status(403).send('Access Denied: You do not have permission to view this page.');
};

module.exports = { isAuthenticated, isAdmin };