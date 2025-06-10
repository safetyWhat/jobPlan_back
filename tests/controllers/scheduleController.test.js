const { PrismaClient } = require('@prisma/client');
const { 
    createScheduledJob, 
    getScheduledJobs, 
    updateScheduledJob, 
    deleteScheduledJob 
} = require('../../controllers/scheduleController');

// Mock Prisma
jest.mock('@prisma/client');

describe('Schedule Controller', () => {
    let mockPrismaCreate;
    let mockPrismaFindMany;
    let mockPrismaFindUnique;
    let mockPrismaUpdate;
    let mockPrismaDelete;
    let mockReq;
    let mockRes;

    beforeEach(() => {
        // Reset mocks before each test
        mockPrismaCreate = jest.fn();
        mockPrismaFindMany = jest.fn();
        mockPrismaFindUnique = jest.fn();
        mockPrismaUpdate = jest.fn();
        mockPrismaDelete = jest.fn();

        PrismaClient.mockImplementation(() => ({
            scheduledJob: {
                create: mockPrismaCreate,
                findMany: mockPrismaFindMany,
                findUnique: mockPrismaFindUnique,
                update: mockPrismaUpdate,
                delete: mockPrismaDelete
            },
            operatorCount: {
                deleteMany: jest.fn()
            },
            scheduledDate: {
                deleteMany: jest.fn()
            }
        }));

        // Mock request and response
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createScheduledJob', () => {
        it('should create a scheduled job successfully', async () => {
            const testDate = new Date();
            mockReq = {
                body: {
                    jobId: 1,
                    dates: [{
                        date: testDate,
                        crewSize: 5,
                        otherIdentifier: ['TIME_AND_MATERIALS'],
                        operator: {
                            type: 'FULL',
                            count: 2
                        }
                    }]
                }
            };

            const mockScheduledJob = {
                id: 1,
                jobId: 1,
                scheduledDates: [{
                    date: testDate,
                    crewSize: 5,
                    otherIdentifier: ['TIME_AND_MATERIALS'],
                    operator: {
                        type: 'FULL',
                        count: 2
                    }
                }]
            };

            mockPrismaCreate.mockResolvedValue(mockScheduledJob);

            await createScheduledJob(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockScheduledJob
            });
        });
    });

    describe('getScheduledJobs', () => {
        it('should get all scheduled jobs', async () => {
            mockReq = { query: {} };
            const mockJobs = [{ id: 1, jobId: 1 }];
            mockPrismaFindMany.mockResolvedValue(mockJobs);

            await getScheduledJobs(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockJobs
            });
        });

        it('should filter by jobId when provided', async () => {
            mockReq = { query: { jobId: '1' } };
            const mockJobs = [{ id: 1, jobId: 1 }];
            mockPrismaFindMany.mockResolvedValue(mockJobs);

            await getScheduledJobs(mockReq, mockRes);

            expect(mockPrismaFindMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { jobId: 1 }
                })
            );
        });
    });

    describe('updateScheduledJob', () => {
        it('should update a scheduled job successfully', async () => {
            const testDate = new Date();
            mockReq = {
                params: { id: '1' },
                body: {
                    dates: [{
                        date: testDate,
                        crewSize: 6,
                        otherIdentifier: ['GRINDING'],
                        operator: {
                            type: 'FULL',
                            count: 3
                        }
                    }]
                }
            };

            const mockExistingJob = {
                id: 1,
                scheduledDates: [{
                    id: 1,
                    operator: { id: 1 }
                }]
            };

            mockPrismaFindUnique.mockResolvedValue(mockExistingJob);
            mockPrismaUpdate.mockResolvedValue({ ...mockExistingJob, ...mockReq.body });

            await updateScheduledJob(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: expect.any(Object)
            });
        });
    });

    describe('deleteScheduledJob', () => {
        it('should delete a scheduled job successfully', async () => {
            mockReq = { params: { id: '1' } };
            
            const mockExistingJob = {
                id: 1,
                scheduledDates: [{
                    id: 1,
                    operator: { id: 1 }
                }]
            };

            mockPrismaFindUnique.mockResolvedValue(mockExistingJob);
            mockPrismaDelete.mockResolvedValue(mockExistingJob);

            await deleteScheduledJob(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Scheduled job deleted successfully'
            });
        });
    });
});