const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware'); // Import middleware

// Apply the isAdmin middleware to ALL routes in this file
router.use(isAdmin);

// All routes below this line are now protected and only accessible by admins

// --- Dashboard ---

/**
 * @route GET /admin/dashboard
 * @description Displays the main admin dashboard with stats and summaries.
 */
router.get('/dashboard', (req, res) => {
    res.send(`Welcome to the admin dashboard, ${req.session.user.name}!`);
});

// --- Employee Management ---

/**
 * @route GET /admin/employees
 * @description Shows a list of all employees.
 */
router.get('/employees', (req, res) => {
    // Logic to fetch and display all users/employees
    console.log('Manage Employees page logic here.');
    // res.render('admin/manage_employees', { employees });
});

/**
 * @route GET /admin/employees/add
 * @description Displays the form to add a new employee.
 */
router.get('/employees/add', (req, res) => {
    console.log('Display "Add Employee" form.');
    // res.render('admin/add_edit_employee', { employee: {} });
});

/**
 * @route POST /admin/employees/add
 * @description Handles the creation of a new employee record.
 */
router.post('/employees/add', (req, res) => {
    // Logic to save the new employee to the database
    console.log('Handle new employee creation logic here.');
    // res.redirect('/admin/employees');
});

/**
 * @route GET /admin/employees/:employeeId/edit
 * @description Displays the form to edit an existing employee's details.
 */
router.get('/employees/:employeeId/edit', (req, res) => {
    // Logic to fetch employee by ID and render edit form
    console.log(`Display "Edit Employee" form for ID: ${req.params.employeeId}`);
    // res.render('admin/add_edit_employee', { employee });
});

/**
 * @route POST /admin/employees/:employeeId/edit
 * @description Handles the update of an employee's record.
 */
router.post('/employees/:employeeId/edit', (req, res) => {
    // Logic to update the employee in the database
    console.log(`Handle update for employee ID: ${req.params.employeeId}`);
    // res.redirect('/admin/employees');
});

/**
 * @route POST /admin/employees/:employeeId/delete
 * @description Deletes an employee record.
 */
router.post('/employees/:employeeId/delete', (req, res) => {
    // Logic to delete the employee from the database
    console.log(`Handle delete for employee ID: ${req.params.employeeId}`);
    // res.redirect('/admin/employees');
});


// --- Project Management ---

/**
 * @route GET /admin/projects
 * @description Shows a list of all projects.
 */
router.get('/projects', (req, res) => {
    // Logic to fetch and display all projects
    console.log('Manage Projects page logic here.');
    // res.render('admin/manage_projects', { projects });
});

/**
 * @route GET /admin/projects/add
 * @description Displays the form to create a new project.
 */
router.get('/projects/add', (req, res) => {
    console.log('Display "Add Project" form.');
    // res.render('admin/add_edit_project', { project: {} });
});

/**
 * @route POST /admin/projects/add
 * @description Handles the creation of a new project.
 */
router.post('/projects/add', (req, res) => {
    // Logic to save the new project to the database
    console.log('Handle new project creation logic here.');
    // res.redirect('/admin/projects');
});

/**
 * @route GET /admin/projects/:projectId/edit
 * @description Displays the form to edit an existing project.
 */
router.get('/projects/:projectId/edit', (req, res) => {
    // Logic to fetch project by ID and render edit form
    console.log(`Display "Edit Project" form for ID: ${req.params.projectId}`);
    // res.render('admin/add_edit_project', { project });
});

/**
 * @route POST /admin/projects/:projectId/edit
 * @description Handles the update of a project's details.
 */
router.post('/projects/:projectId/edit', (req, res) => {
    // Logic to update the project in the database
    console.log(`Handle update for project ID: ${req.params.projectId}`);
    // res.redirect('/admin/projects');
});

/**
 * @route POST /admin/projects/:projectId/delete
 * @description Deletes a project.
 */
router.post('/projects/:projectId/delete', (req, res) => {
    // Logic to delete the project from the database
    console.log(`Handle delete for project ID: ${req.params.projectId}`);
    // res.redirect('/admin/projects');
});

/**
 * @route GET /admin/projects/:projectId
 * @description Displays detailed information for a single project.
 */
router.get('/projects/:projectId', (req, res) => {
    // Logic to fetch full details of a selected project
    console.log(`Display details for project ID: ${req.params.projectId}`);
    // res.render('admin/project_detail', { project });
});


module.exports = router;