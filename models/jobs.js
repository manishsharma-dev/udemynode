const mongoose = require('mongoose');
const validator = require('validator');
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter Job title'],
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please enter Job description'],
        maxlength: [1000, 'Job description cannot exceed 100 characters.']
    },
    email: {
        type: String,
        validate: [validator.email, 'Please add a valid email address']

    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    companyName: {
        type: String,
        required: [true, 'Please add a company name']
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: [
                'Business',
                'Information Technology',
                'Banking',
                'Education',
                'Telecommunication',
                'others'
            ],
            message: 'Please select correct options for industry'
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: ['Full-time', 'Part-time', 'Contract', 'Internship'],
            message: 'Please select correct job type'
        }
    },
    minEducation: {
        type: String,
        required: true,
        enum: {
            values: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate'],
            message: 'Please select correct options for minimum education'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        required: true,
        enum: {
            values: [
                '0 - 2 YRS',
                '2-5 YRS',
                '5-10 YRS',
                '10+ YRS',
            ],
            message: 'Please select correct options for experience'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job'],
    },
    postingDate: {
        type: Date,
        default: Date.now()
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 30)
    }
});