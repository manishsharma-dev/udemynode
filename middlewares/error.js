const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    else if (process.env.NODE_ENV === 'production') {
        error = { ...err }
        error.message = err.message;

        //Wrong mongoose ID error
        if (err.name == 'CastError') {
            const message = 'Resource not found. Invalid: ${err.path}';
            error = new ErrorHandler(message, 404);
        }

        //handling mongoose validation error
        if (err.name == 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new ErrorHandler(message, 400);
        }

        //Handle mongoose duplicate key error
        if(err.code === 11000){
            const message  = `Duplicate ${Object.keys(err.keyValue)} entered.`;
            error = new ErrorHandler(message, 400);
        }
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error.'
        })
    }

}