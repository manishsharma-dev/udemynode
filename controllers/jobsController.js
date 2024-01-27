const Job = require('../models/jobs');
const geoCoder = require('../utils/geocoder');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');

//Get All Jobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors(async (req, res, next) => {
    const apiFilters = new APIFilters(Job.find(), req.query).filter().sort();
    const jobs = await apiFilters.query;
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
})

//Creates a new job => /api/v1/jobs/new
exports.newJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.create(req.body);
    res.status(200).json({
        success: true,
        message: 'Job created successfully',
        data: job
    });
})

//Update job => /api/v1/jobs/:id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Job successfully updated',
        data: job
    })
})

//Get a single job with id and slug => /api/v1/jobs/:id/:slug

exports.getJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.find({ $and: [{ _id: req.params.id }, { slug: req.params.slug }] });
    if (!job || job.length === 0) {
        return next(new ErrorHandler('Job not found', 404));
    }
    res.status(200).json({
        success: true,
        data: job
    })
})

// search job within radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    //Getting Lat & Lng from geocoder
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963;

    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    })

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
})

// Delete a job => /api/v1/jobs/:id
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    }

    await job.deleteOne({ id: req.params.id });

    res.status(200).json({
        success: true,
        message: 'Job successfully removed'
    })
})

//get stats about a topic(job) => /api/v1/stats/:topic

exports.jobStats = catchAsyncErrors(async (req, res, next) => {
    try {
        const stats = await Job.aggregate([
            {
                $match: { $text: { $search: "\"" + req.params.topic + "\"" } }
            },
            {
                $group: {
                    _id: { $toUpper: '$experience' },
                    totalJobs: { $sum: 1 },
                    avgPosition: { $avg: '$positions' },
                    avgSalary: { $avg: '$salary' },
                    minSalary: { $min: '$salary' },
                    maxSalary: { $max: '$salary' },
                }
            }
        ])
        if (stats.length === 0) {
            return next(new ErrorHandler(`No stats found for - ${req.params.topic}`, 200));
        }
        res.status(200).json(
            {
                success: true,
                data: stats
            })
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }




})