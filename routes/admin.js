const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/users');
const Project = require('../models/projects');
const Module = require('../models/modules');

// Middleware-route
router.use(isAdmin);

// Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ role: 'user' });
        const totalProjects = await Project.countDocuments();
        const projectStatusCounts = await Project.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const statusCounts = projectStatusCounts.reduce((acc, status) => {
            acc[status._id] = status.count;
            return acc;
        }, {});
        res.render('admin/admin-dashboard', {
            user: req.session.user,
            totalEmployees,
            totalProjects,
            projectStatusCounts: statusCounts,
            page: 'dashboard'
        });
    } catch (error) {
        res.status(500).send('Error loading dashboard.');
    }
});

// Employees Management

// 1. Display all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await User.find({}); // Fetch all users
        res.render('admin/manage_employees', {
            user: req.session.user,
            employees: employees,
            page: 'employees'
        });
    } catch (error) {
        res.status(500).send('Error fetching employees.');
    }
});

// 2. Add a new employee (get request for getting ui)
router.get('/employees/add', (req, res) => {
    res.render('admin/add_edit_employee', {
        user: req.session.user,
        page: 'employees',
        employee: {}, // Pass an empty object for a new employee
        formAction: '/admin/employees/add',
        title: 'Add New Employee'
    });
});

// 2. Add a new employee (post request for sending it to db)
router.post('/employees/add', async (req, res) => {
    try {
        const { name, email, password, role, designation, department, contact, status } = req.body;

        // Added some extra validation with standard set of rules.
        if (!name || !email || !password || !role) {
            return res.render('admin/add_edit_employee', {
                user: req.session.user, page: 'employees', employee: req.body,
                formAction: '/admin/employees/add', title: 'Add New Employee',
                error: 'Name, email, password, and role are required fields.'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('admin/add_edit_employee', {
                user: req.session.user, page: 'employees', employee: req.body,
                formAction: '/admin/employees/add', title: 'Add New Employee',
                error: 'Please provide a valid email.'
            });
        }
        if (password.length < 8) {
            return res.render('admin/add_edit_employee', {
                user: req.session.user, page: 'employees', employee: req.body,
                formAction: '/admin/employees/add', title: 'Add New Employee',
                error: 'Password must be at least 8 characters long.'
            });
        }


        // Hashing and storing password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new User({
            name, email, password: hashedPassword, role, designation, department, contact, status
        });
        await newEmployee.save();
        res.redirect('/admin/employees');
    } catch (error) {
        // Handle potential duplicate email error from database
        if (error.code === 11000) {
            return res.render('admin/add_edit_employee', {
                user: req.session.user, page: 'employees', employee: req.body,
                formAction: '/admin/employees/add', title: 'Add New Employee',
                error: 'An employee with this email already exists.'
            });
        }
        res.status(500).send('Error creating employee.');
    }
});

// 3. Edit an employee (get to display ui)
router.get('/employees/:id/edit', async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);
        res.render('admin/add_edit_employee', {
            user: req.session.user,
            page: 'employees',
            employee: employee,
            formAction: `/admin/employees/${req.params.id}/edit`,
            title: 'Edit Employee'
        });
    } catch (error) {
        res.status(500).send('Error fetching employee data.');
    }
});

// 3. Edit an employee (post to send info to db)
router.post('/employees/:id/edit', async (req, res) => {
    try {
        const { name, email, role, designation, department, contact, status } = req.body;
        await User.findByIdAndUpdate(req.params.id, {
            name, email, role, designation, department, contact, status
        });
        res.redirect('/admin/employees');
    } catch (error) {
        res.status(500).send('Error updating employee.');
    }
});

// 4. Deletion of an employee
router.post('/employees/:id/delete', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/employees');
    } catch (error) {
        res.status(500).send('Error deleting employee.');
    }
});

// Project Management
// 1. Display all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({}).populate('createdBy', 'name');
        res.render('admin/manage_projects', {
            user: req.session.user,
            projects: projects,
            page: 'projects'
        });
    } catch (error) {
        res.status(500).send('Error fetching projects.');
    }
});

// 2. Add a new project (get to display ui)
router.get('/projects/add', (req, res) => {
    res.render('admin/add_edit_project', {
        user: req.session.user,
        page: 'projects',
        project: {},
        formAction: '/admin/projects/add',
        title: 'Add New Project'
    });
});

// 2. Add a new project (post to send data to db)
router.post('/projects/add', async (req, res) => {
    try {
        const { title, description, startDate, endDate, status } = req.body;
        const newProject = new Project({
            title, description, startDate, endDate, status,
            createdBy: req.session.user.id
        });
        await newProject.save();
        res.redirect('/admin/projects');
    } catch (error) {
        res.status(500).send('Error creating project.');
    }
});

// 3. Updating a project (get for displaying ui)
router.get('/projects/:id/edit', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.render('admin/add_edit_project', {
            user: req.session.user,
            page: 'projects',
            project: project,
            formAction: `/admin/projects/${req.params.id}/edit`,
            title: 'Edit Project'
        });
    } catch (error) {
        res.status(500).send('Error fetching project data.');
    }
});

// 3. Updating a project (post to edit in db)
router.post('/projects/:id/edit', async (req, res) => {
    try {
        const { title, description, startDate, endDate, status } = req.body;
        await Project.findByIdAndUpdate(req.params.id, {
            title, description, startDate, endDate, status
        });
        res.redirect('/admin/projects');
    } catch (error) {
        res.status(500).send('Error updating project.');
    }
});

// 4. Deletion of a project
router.post('/projects/:id/delete', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        // Also delete related modules
        await Module.deleteMany({ projectId: req.params.id });
        res.redirect('/admin/projects');
    } catch (error) {
        res.status(500).send('Error deleting project.');
    }
});

// Project Detail Page
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        const modules = await Module.find({ projectId: req.params.id }).populate('assignedTo', 'name');
        const employees = await User.find({ role: 'user' }); // For assignment dropdown

        res.render('admin/project_detail', {
            user: req.session.user,
            project: project,
            modules: modules,
            employees: employees,
            page: 'projects'
        });
    } catch (error) {
        res.status(500).send('Error fetching project details.');
    }
});


// Assign Module/Task to a Project
router.post('/projects/:id/assign-module', async (req, res) => {
    try {
        const { title, description, assignedTo, status, startDate, endDate } = req.body;
        const newModule = new Module({
            projectId: req.params.id,
            title,
            description,
            assignedTo,
            status,
            startDate,
            endDate
        });
        await newModule.save();
        res.redirect(`/admin/projects/${req.params.id}`);
    } catch (error) {
        res.status(500).send('Error assigning module.');
    }
});


// Admin Profile Page
router.get('/profile', async (req, res) => {
    try {
        const adminData = await User.findById(req.session.user.id);
        res.render("admin/profile", {
            user: req.session.user,
            userData: adminData,
            page: 'profile',
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        res.status(500).send("Error loading profile page.");
    }
});

router.post("/profile", async (req, res) => {
    try {
        const { name, designation, department, contact } = req.body;
        await User.findByIdAndUpdate(req.session.user.id, {
            name, designation, department, contact
        });
        req.session.user.name = name; // Update session
        res.redirect('/admin/profile?success=Profile updated successfully!');
    } catch (error) {
        res.redirect('/admin/profile?error=Failed to update profile.');
    }
});

router.post("/profile/change-password", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.session.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.redirect('/admin/profile?error=Current password is incorrect.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.redirect('/admin/profile?success=Password changed successfully!');
    } catch (error) {
        res.redirect('/admin/profile?error=Failed to change password.');
    }
});

module.exports = router;