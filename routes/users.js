const express = require("express");
const router = express.Router();
const User = require("../models/users")
const { isAuthenticated } = require('../middleware/authMiddleware'); // Import middleware

// Apply the isAuthenticated middleware to ALL routes in this file
router.use(isAuthenticated);

// All routes below are now protected and accessible by any logged-in user
// Dashboard Page
router.get('/dashboard', (req, res) => {
    res.send(`Welcome to your dashboard, ${req.session.user.name}!`);
});

// Projects Page
router.get("/projects",(req,res)=>{
    res.send("Viewing projects logic here.")
});

// ProjectDetails Page
router.get("/project/:project/view-details",(req,res)=>{
    res.send("Viewing details of selected project comes here.")
});

// Status Update Page
router.get("/project/:project/status",(req,res)=>{
    res.send("Status of every project will come here.");
});

// Profile Page
router.get("/profile",(req,res)=>{
    res.send("Status of every project will come here.");
});

module.exports = router;