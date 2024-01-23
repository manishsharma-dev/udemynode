
//Get All Jobs => /api/v1/jobs
exports.getJobs = (req, res, next) => {
    res.status(200).json({
        success : true,
        message : 'Job Routes was successfully created'
    })
}