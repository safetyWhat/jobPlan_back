const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            uapId, 
            sbId, 
            email, 
            phone, 
            departmentId, 
            positionId, 
            hiredAt, 
            wage 
        } = req.body;

        // Filter out undefined fields and empty strings from req.body
        const employeeData = Object.fromEntries(
            Object.entries({
                firstName,
                lastName,
                uapId,
                sbId,
                email,
                phone,
                departmentId,
                positionId,
                hiredAt,
                wage
            }).filter(([_, value]) => value !== undefined && value !== '')
        );

        const newEmployee = await prisma.employee.create({
            data: employeeData,
        });

        res.status(201).json({ success: true, data: newEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create employee', error: error.message });
    }
};

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                department: true,
                position: true,
                trainings: {
                    include: {
                        training: true
                    }
                },
                medicals: {
                    include: {
                        medical: true
                    }
                }
            }
        });
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch employees', error: error.message });
    }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
            include: {
                department: true,
                position: true,
                trainings: {
                    include: {
                        training: true
                    }
                },
                medicals: {
                    include: {
                        medical: true
                    }
                }
            }
        });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch employee', error: error.message });
    }
};
// Update an employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;

    // Confirm the employee exists
    const existingEmployee = await prisma.employee.findUnique({
        where: { id: parseInt(id) },
    });
    if (!existingEmployee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Filter out undefined fields from req.body
    const updatedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== undefined)
    );
    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        if (!updatedEmployee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update employee', error: error.message });
    }
};
// Delete an employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEmployee = await prisma.employee.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, data: deletedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete employee', error: error.message });
    }
};

// Get employees filtered by department and/or position
const getFilteredEmployees = async (req, res) => {
    try {
        const { departmentId, positionId } = req.query;
        
        // Build where clause based on provided filters
        const whereClause = {};
        if (departmentId) whereClause.departmentId = parseInt(departmentId);
        if (positionId) whereClause.positionId = parseInt(positionId);

        const employees = await prisma.employee.findMany({
            where: whereClause,
            include: {
                department: true,
                position: true,
                trainings: {
                    include: {
                        training: true
                    }
                },
                medicals: {
                    include: {
                        medical: true
                    }
                }
            }
        });

        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch filtered employees', error: error.message });
    }
};

const searchEmployees = async (req, res) => {
    try {
        const { query } = req.query;
        const employees = await prisma.employee.findMany({
            where: {
                OR: [
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } },
                ]
            },
            include: {
                department: true,
                position: true,
                trainings: {
                    include: {
                        training: true
                    }
                },
                medicals: {
                    include: {
                        medical: true
                    }
                }
            }
        });
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to search employees', error: error.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getFilteredEmployees,
	searchEmployees
};