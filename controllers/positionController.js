const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new position
const createPosition = async (req, res) => {
    try {
        const { name } = req.body;
        const newPosition = await prisma.position.create({
            data: {
                name
            },
        });
        res.status(201).json({ success: true, data: newPosition });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create position', error: error.message });
    }
};
// Get all positions
const getAllPositions = async (req, res) => {
    try {
        const positions = await prisma.position.findMany();
        res.status(200).json({ success: true, data: positions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch positions', error: error.message });
    }
};
// Get a single position by ID
const getPositionById = async (req, res) => {
    const { id } = req.params;
    try {
        const position = await prisma.position.findUnique({
            where: { id: parseInt(id) },
        });
        if (!position) {
            return res.status(404).json({ success: false, message: 'Position not found' });
        }
        res.status(200).json({ success: true, data: position });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch position', error: error.message });
    }
};
// Update a position by ID
const updatePosition = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name field is required' });
    }

    try {
        const updatedPosition = await prisma.position.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        res.status(200).json({ success: true, data: updatedPosition });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Position not found' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update position', error: error.message });
    }
};
// Delete a position by ID
const deletePosition = async (req, res) => {
    const { id } = req.params;

    // Confirm the position exists
    const existingPosition = await prisma.position.findUnique({
        where: { id: parseInt(id) },
    });
    if (!existingPosition) {
        return res.status(404).json({ success: false, message: 'Position not found' });
    }
    try {
        await prisma.position.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, message: 'Position deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete position', error: error.message });
    }
};
// Export the functions
module.exports = {
    createPosition,
    getAllPositions,
    getPositionById,
    updatePosition,
    deletePosition
};