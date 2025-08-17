const express = require("express");
const router = express.Router();
const User = require("../models/users")

// User Login (to be implemented)
router.get("/",(req,res)=>{
    res.send("This will be default login page.")
});
// Dashboard Page
router.get("/dashboard",(req,res)=>{
    res.send("Dashboard Logic Comes Here")
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