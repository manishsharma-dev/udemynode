const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    name : {
        type : 'string',
        required : [true, 'Please enter your name']
    },
    email : {
        type : 'string',
        required : [true, 'Please enter your email address'],
        unique : true,
        validate : [validator.isEmail, 'Please enter a valid email address']
    },
    role : {
        type : 'string',
        enum : {
            values : ['user', 'employer'],
            messages : ['Please select correct role']
        },
        default : 'user',
        required : [true, 'Please select correct role']
    },
    password : {
        type : 'string',
        required : [true, 'Please enter password'],
        minlength : [8, 'Your password must be atleast 8 characters'],
        select : false,        
    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    resetPasswordToken : string,
    resetPasswordExpire : Date
})