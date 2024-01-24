const Job = require('../models/jobs');
//Get All Jobs => /api/v1/jobs
exports.getJobs = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Job Routes was successfully created'
    })
}

//Creates a new job => /api/v1/jobs/new

exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body);
    res.status(200).json({
        success: true,
        message: 'Job created successfully',
        data: job
    });    
}