const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a scheduled job
const createScheduledJob = async (req, res) => {
    try {
        const { jobId, dates } = req.body;
        const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const scheduledJob = await prisma.scheduledJob.create({
            data: {
                jobId: jobId,
                scheduledDates: {
                    create: sortedDates.map((date) => ({
                        date: new Date(date),
                    })),
                },
            },
            include: {
                job: true,
                scheduledDates: true,
            },
        });

        res.status(201).json({ success: true, data: scheduledJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create scheduled job', error: error.message });
    }
};

// Get all scheduled jobs
const getScheduledJobs = async (req, res) => {
    try {
        const { jobId } = req.query;
        const filter = jobId ? { jobId: parseInt(jobId) } : {};
        
        const scheduledJobs = await prisma.scheduledJob.findMany({
            where: filter,
            include: {
                job: true,
                scheduledDates: true,
            },
        });

        res.status(200).json({ success: true, data: scheduledJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch scheduled jobs', error: error.message });
    }
};

// Edit a scheduled job
const updateScheduledJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { dates } = req.body;
        
        // Check if scheduled job exists
        const existingJob = await prisma.scheduledJob.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingJob) {
            return res.status(404).json({ success: false, message: 'Scheduled job not found' });
        }

        const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // Delete existing dates
        await prisma.scheduledDate.deleteMany({
            where: { scheduledJobId: parseInt(id) },
        });

        // Add new dates
        const updatedScheduledJob = await prisma.scheduledJob.update({
            where: { id: parseInt(id) },
            data: {
                scheduledDates: {
                    create: sortedDates.map((date) => ({
                        date: new Date(date),
                    })),
                },
            },
            include: {
                job: true,
                scheduledDates: true,
            },
        });

        res.status(200).json({ success: true, data: updatedScheduledJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update scheduled job', error: error.message });
    }
};

// Delete a scheduled job
const deleteScheduledJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if scheduled job exists
        const existingJob = await prisma.scheduledJob.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingJob) {
            return res.status(404).json({ success: false, message: 'Scheduled job not found' });
        }

        await prisma.scheduledJob.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ success: true, message: 'Scheduled job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete scheduled job', error: error.message });
    }
};

module.exports = {
    createScheduledJob,
    getScheduledJobs,
    updateScheduledJob,
    deleteScheduledJob,
};