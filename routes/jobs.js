const express = require('express');

const router = express.Router();
//Imort jobs controller methods

const { getJobs, newJob, getJobsInRadius, updateJob, deleteJob, getJob, jobStats } = require('../controllers/jobsController');

const { isAuthenticated } = require('../middlewares/auth');


router.route('/jobs').get(isAuthenticated, getJobs);

router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/stats/:topic').get(jobStats);

router.route('/jobs/new').post(isAuthenticated, newJob);

router.route('/jobs/:id')
    .put(isAuthenticated, updateJob)
    .delete(isAuthenticated, deleteJob);

router.route('/jobs/:id/:slug').get(getJob);

module.exports = router;