const express = require("express");
const router = express.Router();


// User Login (to be implemented)
router.get("/",(req,res)=>{
    console.log("This will be default login page.")
});
// Dashboard Page
router.get("/dashboard",(req,res)=>{
    console.log("Dashboard Logic Comes Here")
});

// Projects Page
router.get("/projects",(req,res)=>{
    console.log("Viewing projects logic here.")
});

// ProjectDetails Page
router.get("/:project/view-details",(req,res)=>{
    console.log("Viewing details of selected project comes here.")
});

// Status Update Page
router.get("/:project/status",(req,res)=>{
    console.log("Status of every project will come here.");
});

// Profile Page
router.get("/profile",(req,res)=>{
    console.log("Status of every project will come here.");
});

module.exports = router;