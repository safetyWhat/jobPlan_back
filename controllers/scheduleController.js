const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a scheduled job
const createScheduledJob = async (req, res) => {
    try {
        const { jobId, dates } = req.body;
        
        // Check if job is already scheduled
        const existingScheduledJob = await prisma.scheduledJob.findFirst({
            where: { jobId: parseInt(jobId) },
            include: {
                scheduledDates: {
                    include: {
                        operator: true
                    }
                }
            }
        });
        
        // If job is already scheduled, add new dates to it
        if (existingScheduledJob) {
            // Use the same logic as updateScheduledJob but without deleting existing dates
            const sortedDates = dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            // Add new dates with their operators
            const updatedScheduledJob = await prisma.scheduledJob.update({
                where: { id: existingScheduledJob.id },
                data: {
                    scheduledDates: {
                        create: sortedDates.map((date) => ({
                            date: new Date(date.date),
                            crewSize: date.crewSize || null,
                            otherIdentifier: date.otherIdentifier || ['NONE'],
                            operator: {
                                create: date.operator.map(op => ({
									type: op.type || 'NONE',
									count: op.count || null
								})) // Create operator entries for each operator
                            }
                        })),
                    },
                },
                include: {
                    job: true,
                    scheduledDates: {
                        include: {
                            operator: true
                        }
                    },
                },
            });
            
            return res.status(200).json({ 
                success: true, 
                data: updatedScheduledJob, 
                message: 'Added dates to existing scheduled job'
            });
        }
        
        // Original logic for creating a new scheduled job
        const sortedDates = dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const scheduledJob = await prisma.scheduledJob.create({
            data: {
                jobId: jobId,
                scheduledDates: {
                    create: sortedDates.map((date) => ({
                        date: new Date(date.date),
                        crewSize: date.crewSize || null,
                        otherIdentifier: date.otherIdentifier || ['NONE'],
                        operator: {
							create: date.operator.map(op => ({
								type: op.type || 'NONE',
								count: op.count || null
							})) // Create operator entries for each operator
						}
                    })),
                },
            },
            include: {
                job: true,
                scheduledDates: {
                    include: {
                        operator: true
                    }
                },
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
                scheduledDates: {
                    include: {
                        operator: true
                    }
                },
            },
        });

        res.status(200).json({ success: true, data: scheduledJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch scheduled jobs', error: error.message });
    }
};

// Update a scheduled job
const updateScheduledJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { dates } = req.body;

        const existingJob = await prisma.scheduledJob.findUnique({
            where: { id: parseInt(id) },
            include: {
                scheduledDates: {
                    include: {
                        operator: true
                    }
                }
            }
        });

        if (!existingJob) {
            return res.status(404).json({ success: false, message: 'Scheduled job not found' });
        }

        const sortedDates = dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Delete existing dates and their related operators
        for (const date of existingJob.scheduledDates) {
            if (date.operator) {
                await prisma.operatorCount.deleteMany({
                    where: { scheduledDateId: date.id }
                });
            }
        }
        await prisma.scheduledDate.deleteMany({
            where: { scheduledJobId: parseInt(id) },
        });

        // Add new dates with their operators
        const updatedScheduledJob = await prisma.scheduledJob.update({
            where: { id: parseInt(id) },
            data: {
                scheduledDates: {
                    create: sortedDates.map((date) => ({
                        date: new Date(date.date),
                        crewSize: date.crewSize || null,
                        otherIdentifier: date.otherIdentifier || ['NONE'],
                        operator: {
                            create: date.operator ? {
                                type: date.operator.type || 'NONE',
                                count: date.operator.count || null
                            } : undefined
                        }
                    })),
                },
            },
            include: {
                job: true,
                scheduledDates: {
                    include: {
                        operator: true
                    }
                },
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

        const existingJob = await prisma.scheduledJob.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingJob) {
            return res.status(404).json({ success: false, message: 'Scheduled job not found' });
        }

        // Prisma will handle cascade deletes for scheduledDates and operators
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