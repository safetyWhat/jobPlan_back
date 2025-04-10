const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new department
const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const newDepartment = await prisma.department.create({
            data: {
                name,
            },
        });
        res.status(201).json({ success: true, data: newDepartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create department', error: error.message });
    }
};
// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany();
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch departments', error: error.message });
    }
};
// Get a single department by ID
const getDepartmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await prisma.department.findUnique({
            where: { id: parseInt(id) },
        });
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch department', error: error.message });
    }
};
// Update a department by ID
const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name field is required' });
    }

    try {
        const updatedDepartment = await prisma.department.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        res.status(200).json({ success: true, data: updatedDepartment });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update department', error: error.message });
    }
};
// Delete a department by ID
const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    // Confirm the department exists
    const existingDepartment = await prisma.department.findUnique({
        where: { id: parseInt(id) },
    });
    if (!existingDepartment) {
        return res.status(404).json({ success: false, message: 'Department not found' });
    }

    try {
        await prisma.department.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, message: 'Department deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete department', error: error.message });
    }
};
// Export the functions
module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};