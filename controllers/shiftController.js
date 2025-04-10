const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new shift
const createShift = async (req, res) => {
    try {
        const { employeeId, shiftDate, jobNum, comment, hours, sbJobId } = req.body;

        const shift = await prisma.shift.create({
            data: {
                employeeId: parseInt(employeeId),
                shiftDate: new Date(shiftDate),
                jobNum,
                comment,
                hours: hours ? parseFloat(hours) : null,
                sbJobId
            },
            include: {
                employee: true
            }
        });

        res.status(201).json(shift);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all shifts
const getAllShifts = async (req, res) => {
    try {
        const shifts = await prisma.shift.findMany({
            include: {
                employee: true
            }
        });
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get shift by ID
const getShiftById = async (req, res) => {
    try {
        const { id } = req.params;
        const shift = await prisma.shift.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                employee: true
            }
        });

        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update shift
const updateShift = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Filter out undefined fields
        const updateData = Object.fromEntries(
            Object.entries(req.body)
                .filter(([key, value]) => 
                    value !== undefined && 
                    ['jobNum', 'comment', 'hours', 'sbJobId'].includes(key)
                )
                .map(([key, value]) => 
                    key === 'hours' ? [key, value ? parseFloat(value) : null] : [key, value]
                )
        );

        const shift = await prisma.shift.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { employee: true }
        });

        res.status(200).json(shift);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete shift
const deleteShift = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.shift.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createShift,
    getAllShifts,
    getShiftById,
    updateShift,
    deleteShift
};