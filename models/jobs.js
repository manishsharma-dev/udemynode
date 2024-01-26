const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

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
        validate: [validator.isEmail, 'Please add a valid email address']

    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    industry: {
        type: [String],
        required: [true, 'Please add a industry'],
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
        required: [true, 'Please enter job type'],
        enum: {
            values: ['Full-time', 'Part-time', 'Contract', 'Internship'],
            message: 'Please select correct job type'
        }
    },
    minEducation: {
        type: String,
        required: [true, 'Please enter min education'],
        enum: {
            values: ['High School', 'Associate', 'Bachelors', 'Master', 'Doctorate'],
            message: 'Please select correct options for minimum education'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        required: [true, 'Please enter experience'],
        enum: {
            values: [
                'No Experience',
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
    },
    applicantApplied: {
        type: [Object],
        select: false
    }
});

//creating job slug 
jobSchema.pre('save', function (next) {
    //creating slug before saving
    this.slug = slugify(this.title, { lower: true });
    next();
})

//Setting up location
jobSchema.pre('save', async function (next) {
    //creating slug before saving
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode

    }
    next();
})

module.exports = mongoose.model('job', jobSchema);