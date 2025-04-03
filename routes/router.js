const express = require('express');
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const router = express.Router();

router.post('/jobs', createJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

module.exports = router;