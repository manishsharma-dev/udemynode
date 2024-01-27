const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorhandler');
const sendToken  = require('../utils/jwtToken');
//Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, role, password } = req.body;

    const user = await User.create({
        name,
        email,
        role,
        password
    })

    sendToken(user,200,res);    
})

//Login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checks if request is empty
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password'), 400);
    }

    //Finding user is DB

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password'), 401);
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password'), 401);
    }
   
    sendToken(user,200,res);  
})