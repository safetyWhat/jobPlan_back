const express = require('express');
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, getFilteredEmployees, searchEmployees } = require('../controllers/employeeController');
const { createPosition, getAllPositions, getPositionById, updatePosition, deletePosition } = require('../controllers/positionController');
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer, searchCustomers } = require('../controllers/customerController');
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, getFilteredJobs, searchJobs } = require('../controllers/jobController');
const { createShift, getAllShifts, getShiftById, updateShift, deleteShift } = require('../controllers/shiftController');
const { createScheduledJob, getScheduledJobs, updateScheduledJob,  deleteScheduledJob } = require('../controllers/scheduleController');
const router = express.Router();

// Define routes for employee operations
router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);
router.get('/employees/search', searchEmployees);
router.get('/employees/filter', getFilteredEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Define routes for position operations
router.post('/positions', createPosition);
router.get('/positions', getAllPositions);
router.get('/positions/:id', getPositionById);
router.put('/positions/:id', updatePosition);
router.delete('/positions/:id', deletePosition);

// Define routes for department operations
router.post('/departments', createDepartment);
router.get('/departments', getAllDepartments);
router.get('/departments/:id', getDepartmentById);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Define routes for customer operations
router.post('/customers', createCustomer);
router.get('/customers', getAllCustomers);
router.get('/customers/search', searchCustomers);
router.get('/customers/:id', getCustomerById);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// Define routes for job operations
router.post('/jobs', createJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/search', searchJobs);
router.get('/jobs/filter', getFilteredJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Define routes for shift operations
router.post('/shifts', createShift);
router.get('/shifts', getAllShifts);
router.get('/shifts/:id', getShiftById);
router.put('/shifts/:id', updateShift);
router.delete('/shifts/:id', deleteShift);

// Define routes for scheduled job operations
router.post('/scheduled-jobs', createScheduledJob);
router.get('/scheduled-jobs', getScheduledJobs);
router.put('/scheduled-jobs/:id', updateScheduledJob);
router.delete('/scheduled-jobs/:id', deleteScheduledJob);

module.exports = router;