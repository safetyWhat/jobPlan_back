const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new job
const createJob = async (req, res) => {
    try {
        const {
        jobName,
        jobNum,
        sbId,
        siteAddress,
        customerId,
        projectManagerId,
        active,
        prevWage,
        driveTime,
        } = req.body;

        // Convert driveTime to uppercase if it exists
        const formattedDriveTime = driveTime ? driveTime.toUpperCase() : undefined;

        const newJob = await prisma.job.create({
        data: {
            jobName,
            jobNum,
            sbId,
            siteAddress,
            customerId,
            projectManagerId,
            active,
            prevWage,
            driveTime: formattedDriveTime,
        },
        });

        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create job', error: error.message });
    }
};

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                customerName: true,
                projectManager: true,
            }
        });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to fetch jobs', error: error.message });
    }
};

// Get a single job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
            include: {
                customerName: true,
                projectManager: true,
            }
        });

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch job', error: error.message });
    }
};

// Update a job by ID
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if job exists first
        const existingJob = await prisma.job.findUnique({
        where: { id: parseInt(id) },
        });

        if (!existingJob) {
        return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Filter out undefined fields from req.body
        const updateData = {};
        const allowedFields = [
            'jobName',
            'jobNum',
            'sbId',
            'siteAddress',
            'customerId',
            'projectManagerId',
            'active',
            'complete',
            'prevWage',
        ];

        for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
        }
        
        // Handle driveTime enum separately
        if (req.body.driveTime !== undefined) {
            updateData.driveTime = req.body.driveTime.toUpperCase();
        }

        const updatedJob = await prisma.job.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
            customerName: true,
            projectManager: true,
        },
        });

        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.status(500).json({ success: false, message: 'Failed to update job', error: error.message });
    }
};

// Delete a job by ID
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if job exists first
        const existingJob = await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingJob) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        await prisma.job.delete({
        where: { id: parseInt(id) },
        });

        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete job', error: error.message });
    }
};

// Get jobs with filters
const getFilteredJobs = async (req, res) => {
    try {
        const { jobNum, projectManagerId, customerId, active, driveTime, prevWage } = req.query;
        
        // Build where clause based on provided filters
        const whereClause = {};
        
        if (jobNum) whereClause.jobNum = { contains: jobNum };
        if (projectManagerId) whereClause.projectManagerId = parseInt(projectManagerId);
        if (customerId) whereClause.customerId = parseInt(customerId);
        if (active !== undefined) whereClause.active = active === 'true';
        if (driveTime) whereClause.driveTime = driveTime.toUpperCase();
        if (prevWage !== undefined) whereClause.prevWage = prevWage === 'true';

        const jobs = await prisma.job.findMany({
            where: whereClause,
            include: {
                customerName: true,
                projectManager: true,
            }
        });

        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch filtered jobs', 
            error: error.message 
        });
    }
};
// Search jobs
const searchJobs = async (req, res) => {
    try {
        const { query } = req.query;
		console.log('Search query:', query);
        const jobs = await prisma.job.findMany({
            where: {
                OR: [
                    { jobName: { contains: query, mode: 'insensitive' } },
                    { jobNum: { contains: query, mode: 'insensitive' } },
                    { sbId: { contains: query, mode: 'insensitive' } },
                    { siteAddress: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                customerName: true,
                projectManager: true
            }
        });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to search jobs', error: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getFilteredJobs,
	searchJobs
};