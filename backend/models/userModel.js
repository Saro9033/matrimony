const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')

const userSchema = new mongoose.Schema({
    profileFor: {
        type: String,
        required: [true, 'Please select profile for'],
        enum: {
            values: ['myself', 'daughter', 'son', 'friend', 'sister', 'brother', 'relative'],
            message: 'Invalid value for profileFor. Allowed values are: myself, daughter, son, friend, sister, brother, relative'
        }
    },
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter Email Id'],
        unique: [true, 'Duplicate Key error'],
        trim: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please enter Email Id'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    phoneNumber: {
        type: String,
    },
    gender: {
        type: String,
        required: [true, 'Please enter gender'],
        enum: {
            values: ['male', 'female'],
            message: 'Invalid value for gender.'
        }
    },
    DOB: {
        type: Date,
        validate: {
            validator: function (value) {
                // Calculate age from DOB
                const age = moment().diff(value, 'years');
                return age >= 21; // Ensure the user is at least 21 years old
            },
            message: 'User must be at least 21 years old'
        }
    },
    subCaste: {
        type: String,
        enum: {
            values: ['Kumhars (Potters)', 'Rajput', 'Suthar (Carpenters)', 'Badhai', 'Goldsmiths (Sonis)', 'Blacksmiths (Lohars)', 'Architects (Vastu Shastris)', 'Masons (Mistri)'],
            message: 'Invalid value for subCaste. Kumhars (Potters), Rajput, Suthar (Carpenter, Badhai, Goldsmiths (Sonis), Blacksmiths (Lohars), Architects (Vastu Shastris),Masons (Mistri)'
        }
    },
    motherTongue: {
        type: String,
    },
    maritalStatus: {
        type: String,
        enum: {
            values: ['Single', 'Married', 'Divorced', 'Widowed'],
            message: 'Invalid value for maritalStatus'
        }
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    height: {
        type: String,
    },
    education: {
        type: String,
        enum: {
            values: ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'],
            message: 'Invalid value for education'
        }
    },
    occupation: {
        type: String,
    },
    income: {
        type: Number,
    },
    physicalStatus: {
        type: String,
        enum: {
            values: ['Fit', 'Average', 'Overweight', 'Underweight'],
            message: 'Invalid value for physicalStatus'
        }
    },
    familyStatus: {
        type: String,
        enum: {
            values: ['lower', 'middle', 'high'],
            message: 'Invalid value for familyStatus'
        }
    },
    familyType: {
        type: String,
        enum: {
            values: ['Nuclear', 'Joint'],
            message: 'Invalid value for familyType'
        }
    },
    about: {
        type: String,
    },




    // college: {
    //     type: String,
    // },
    // eatingHabits: {
    //     type: String,
    //     enum: {
    //         values: ['vegetarian', 'non-vegetarian', 'eggetarian', 'vegan'],
    //         message: 'Invalid value for Eating Habits'
    //     }
    // },
    // drinkingHabits: {
    //     type: String,
    //     enum: {
    //         values: ['Non-drinker', 'Light/social drinker', 'Regular-drinker'],
    //         message: 'Invalid value for Drinking Habits'
    //     }
    // },
    // smokingHabits: {
    //     type: String,
    //     enum: {
    //         values: ['Non-smoker', 'Light/social smoker', 'Regular-smoker'],
    //         message: 'Invalid value for Drinking Habits'
    //     }
    // },

    // Religious
    star: {
        type: String,
        enum: {
            values: [
                'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
                'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
                'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
                'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
                'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
                'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
            ],
            message: 'Invalid value for star'
        }
    },
    raasi: {
        type: String,
        enum: {
            values: [
                'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
                'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
                'Tula (Libra)', 'Vrischika (Scorpio)', 'Dhanu (Sagittarius)',
                'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
            ],
            message: 'Invalid value for Raasi'
        }
    },
    gothra: {
        type: String,
        enum: {
            values: [
                'Bharadwaja', 'Kashyapa', 'Vasishta', 'Agastya', 'Atri',
                'Pulasthya', 'Pulaha', 'Kratu', 'Yajnavalkya', 'Vamadeva',
                'Katyayana', 'Sankara', 'Parasara', 'Jabala', 'Bhrigu'
            ],
            message: 'Invalid value for Gothra'
        }
    },
    chevvaiDosham: {
        type: String,
        enum: {
            values: ['YES', 'NO', 'Don\'t Know'],
            message: 'Invalid value for chevvaiDosham'
        }
    },


    avatar: {
        type: String,
    },

    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
}, {
    timestamps: true
})

//middleware function to hiding(hashing) passoword
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//To generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_TIME }
    )
}

//To validate password
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//To resetPassword
userSchema.methods.getResetToken = function () {
    //generate token
    const token = crypto.randomBytes(20).toString('hex');

    //generate hash and set resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    //set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
    return token
}

module.exports = mongoose.model('User', userSchema)