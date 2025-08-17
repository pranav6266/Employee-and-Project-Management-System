const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('../middleware/authMiddleware');
const Module = require('../models/modules');
const User = require('../models/users');

// Apply the isAuthenticated middleware to ALL routes in this file
router.use(isAuthenticated);

// --- Dashboard Page ---
router.get('/dashboard', async (req, res) => {
    try {
        const assignedModules = await Module.find({ assignedTo: req.session.user.id })
            .populate('projectId', 'title');

        res.render('users/user-dashboard', {
            user: req.session.user,
            assignedModules: assignedModules
        });
    } catch (error) {
        console.error('Error fetching user dashboard data:', error);
        res.status(500).send('Error loading your dashboard.');
    }
});

// --- Projects Page: View all assigned projects/tasks ---
router.get("/projects", async (req, res) => {
    try {
        const userModules = await Module.find({ assignedTo: req.session.user.id })
            .populate('projectId', 'title status'); // Get project title and status

        res.render("users/projects", {
            user: req.session.user,
            modules: userModules
        });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).send('Error loading projects page.');
    }
});

// --- Project Detail Page: View details of a single task ---
router.get("/project/:moduleId/view-details", async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId)
            .populate('projectId'); // Get full project document

        if (!module || module.assignedTo.toString() !== req.session.user.id) {
            return res.status(404).send("Task not found or you don't have permission to view it.");
        }

        res.render("users/project_detail", {
            user: req.session.user,
            module: module
        });
    } catch (error) {
        console.error('Error fetching module details:', error);
        res.status(500).send('Error loading task details.');
    }
});

// --- Status Update Page (GET): Display the form ---
router.get("/project/:moduleId/status", async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);
        if (!module || module.assignedTo.toString() !== req.session.user.id) {
            return res.status(404).send("Task not found or you don't have permission to update it.");
        }
        res.render("users/status_update", {
            user: req.session.user,
            module: module
        });
    } catch (error) {
        console.error('Error fetching module for status update:', error);
        res.status(500).send('Error loading status update page.');
    }
});

// --- Status Update Page (POST): Handle the form submission ---
router.post("/project/:moduleId/status", async (req, res) => {
    try {
        const { status, progressNotes } = req.body;
        const moduleId = req.params.moduleId;

        const module = await Module.findById(moduleId);

        // Authorization check
        if (!module || module.assignedTo.toString() !== req.session.user.id) {
            return res.status(403).send("You do not have permission to update this task.");
        }

        await Module.findByIdAndUpdate(moduleId, {
            status: status,
            progressNotes: progressNotes
        });

        res.redirect(`/users/project/${moduleId}/view-details`);
    } catch (error) {
        console.error('Error updating module status:', error);
        res.status(500).send('Failed to update status.');
    }
});


// --- Profile Page (GET): Display user information ---
router.get("/profile", async (req, res) => {
    try {
        const userData = await User.findById(req.session.user.id);
        res.render("users/profile", {
            user: req.session.user,
            userData: userData,
            success: req.query.success, // For showing success messages
            error: req.query.error // For showing error messages
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send("Error loading profile page.");
    }
});

// --- Profile Page (POST): Handle profile details update ---
router.post("/profile", async (req, res) => {
    try {
        const { name, designation, department, contact } = req.body;
        await User.findByIdAndUpdate(req.session.user.id, {
            name,
            designation,
            department,
            contact
        });

        // Update session name
        req.session.user.name = name;

        res.redirect('/users/profile?success=Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.redirect('/users/profile?error=Failed to update profile.');
    }
});

// --- Profile Page (POST): Handle password change ---
router.post("/profile/change-password", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.session.user.id);

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.redirect('/users/profile?error=Current password is incorrect.');
        }

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.redirect('/users/profile?success=Password changed successfully!');

    } catch (error) {
        console.error('Error changing password:', error);
        res.redirect('/users/profile?error=Failed to change password.');
    }
});


module.exports = router;