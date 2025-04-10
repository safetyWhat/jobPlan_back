const express = require('express');
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { createPosition, getAllPositions, getPositionById, updatePosition, deletePosition } = require('../controllers/positionController');
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { createShift, getAllShifts, getShiftById, updateShift, deleteShift } = require('../controllers/shiftController');
const router = express.Router();

// Define routes for employee operations
router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);
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
router.get('/customers/:id', getCustomerById);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// Define routes for job operations
router.post('/jobs', createJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Define routes for shift operations
router.post('/shifts', createShift);
router.get('/shifts', getAllShifts);
router.get('/shifts/:id', getShiftById);
router.put('/shifts/:id', updateShift);
router.delete('/shifts/:id', deleteShift);

module.exports = router;