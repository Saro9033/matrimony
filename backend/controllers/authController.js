const CatchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const errorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/jwt')
const crypto = require('crypto')
const bucket = require('../Firebase');
const SearchFeatures = require('../utils/searchFeatures')

const userJsonData = require('../userJsonData.json')
    
//To register user
exports.registerUser = CatchAsyncError(async (req, res, next) => {
    let avatarUrl = null;

    try {
        if (req.file) {
        const originalname = req.file.originalname;
        const fileUploadPath = `usersAvatar/${originalname}`;
        
        // Upload the file to Firebase Storage
        await bucket.upload(req.file.path, {
            destination: fileUploadPath,
            metadata: {
                contentType: req.file.mimetype
            }
        });

        // Construct the avatar URL
        const [url] = await bucket.file(fileUploadPath).getSignedUrl({
            action: 'read',
            expires: '03-09-2491' // Replace with an appropriate expiration date or duration
        });
        
        avatarUrl = url;
    }else{
        if(req.body.gender==="male"){
            avatarUrl = "https://firebasestorage.googleapis.com/v0/b/matrimony-site-6c61b.appspot.com/o/defaultAvatars%2Fmale-avatar.svg?alt=media&token=62695fc5-5f4c-47fb-9070-ed561a2a2702"
        }
        if(req.body.gender==="female"){
            avatarUrl = "https://firebasestorage.googleapis.com/v0/b/matrimony-site-6c61b.appspot.com/o/defaultAvatars%2Ffemale-avatar.svg?alt=media&token=d90bf2a1-83fb-42d9-a74e-8422c3d168f7"
        }
    }
        // Create user in database with avatarUrl
        const user = await User.create({...req.body, avatar:avatarUrl });

        sendToken(user, 201, res);
    } catch (err) {
        return next(err); 
    }
});


//Update avatar PATCH
exports.updateUserAvatar = CatchAsyncError(async (req, res, next) => {
    let avatarUrl = null;

    try {
        const userId = req.user.id; // Assuming you have the user ID in req.user.id after authentication
        
        // Check if a file was uploaded
        if (req.file) {
            const originalname = req.file.originalname;
            const fileUploadPath = `usersAvatar/${originalname}`;
            
            // Upload the new avatar to Firebase Storage
            await bucket.upload(req.file.path, {
                destination: fileUploadPath,
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            // Get the URL for the uploaded avatar
            const [url] = await bucket.file(fileUploadPath).getSignedUrl({
                action: 'read',
                expires: '03-09-2491', // Replace with an appropriate expiration date
            });

            avatarUrl = url;
        } else {
            return res.status(400).json({ message: "No avatar file uploaded" });
        }

        // Update the user's avatar in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            avatar: updatedUser.avatar,
        });
    } catch (err) {
        return next(err);
    }
});


//To Login user = /api/login
exports.loginUser = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new errorHandler('Please enter email & password', 400))
    }

    //finding the user data from Database 
    //*password field is not here bcoz we have hide password in userModel that's why we select  +password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new errorHandler('Invalid email or password', 401))
    }

    if (! await user.isValidPassword(password)) {
        return next(new errorHandler('Invalid email or password', 401))
    }

    await sendToken(user, 201, res)
})


//To logout User = /api/logout
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "Logged Out"
        })
}


//Forgot password by entering ur email in body = /api/password/forgot
exports.forgotPassword = CatchAsyncError(async (req, res, next) => {
    //get user by email
    const user = await User.findOne({ email: req.body.email })

    //If email is not in DB
    if (!user) {
        return next(new errorHandler('Invalid Email ID', 404))
    }

    //If email is correct then generate reset token
    const resetToken = user.getResetToken()
    await user.save({ validateBeforeSave: false })

    let BASE_URL =`http://localhost:${process.env.PORT}`

    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    //Create reset URL
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`
    console.log(resetToken)
    //Create email message
    const message = `Your password reset url is as follows \n\n
                     ${resetUrl}  \n\n If you have not requested this email, then ignore it.`

    //sending email to reset password
    try {

        sendEmail({
            email: user.email,
            subject: "VishwaKarma Weddings Password Recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new errorHandler(error.message), 500)
    }
})


//reset password by passing password and confirmPassword in body = api/password/reset/:token
exports.resetPassword = CatchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //get user data by user resetPasswordToken
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new errorHandler('Password reset token is invalid or expired', 404))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler('Password does not match', 404))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined
    await user.save({ validateBeforeSave: false })

    sendToken(user, 201, res)
})


//Get User Profile - api/myprofile
exports.getUserProfile = CatchAsyncError(async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new errorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new errorHandler("Server error", 500));
    }
});


//Update User Profile - api/update
exports.updateProfile = CatchAsyncError(async (req, res, next) => {
    let newUserData = {
       ...req.body
    };

    if (req.file) {
        const originalname = req.file.originalname;
        const fileUploadPath = `User/${originalname}`;

        // Upload the file to Firebase Storage
        await bucket.upload(req.file.path, {
            destination: fileUploadPath,
            metadata: {
                contentType: req.file.mimetype
            }
        });

        // Construct the avatar URL
        const [url] = await bucket.file(fileUploadPath).getSignedUrl({
            action: 'read',
            expires: '03-09-2491' 
        });

        newUserData.avatar = url; 
    }

    

    // Update user in the database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, 
        runValidators: true 
    });

    await user.save()

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        user
    });
});


/* ***************USERS***************** */

exports.getCommonUsers = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new errorHandler(`User not found with this id ${req.user.id}`, 404));
    }

    let oppositeGender = user.gender === "male" ? "female" : "male";
    const commonUsers = await User.find({ gender: oppositeGender });

    // Return the list of common users
    return res.status(200).json({
        success: true,
        users: commonUsers
    });
});

exports.getMatchUsers = CatchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new errorHandler(`User not found with this id ${req.user.id}`, 404));
    }

    let oppositeGender = user.gender === "male" ? "female" : "male";

    let query = User.find({ gender: oppositeGender });

    const features = new SearchFeatures(query,  req.query)
        .filter()      
        .search()    
        .sort()          
        .timeFilter()   
        .paginate(page, limit); 

    const users = await features.exec();

        let query2 = User.find({ gender: oppositeGender });

        const totalFilter = new SearchFeatures(query2,  req.query)
            .filter()        
            .search()    
            .sort()          
            .timeFilter()   
    
        // Execute the query
        let total = await totalFilter.exec();
        total = total.length


        res.status(200).json({
        success: true,
        page,
        limit,
        total,
        count: users.length,
        users
    });
});

/* ******** ADMIN ************* */


exports.insertManyUsers = CatchAsyncError(async (req, res, next) => {
    let usersData = userJsonData; // Assuming req.body contains an array of users

    // Iterate over the users data to set avatar URL based on gender
    usersData = usersData.map(user => {
        let avatarUrl;
        if (user.gender === "male") {
            avatarUrl = "https://firebasestorage.googleapis.com/v0/b/matrimony-site-6c61b.appspot.com/o/defaultAvatars%2Fmale-avatar.svg?alt=media&token=62695fc5-5f4c-47fb-9070-ed561a2a2702";
        } else if (user.gender === "female") {
            avatarUrl = "https://firebasestorage.googleapis.com/v0/b/matrimony-site-6c61b.appspot.com/o/defaultAvatars%2Ffemale-avatar.svg?alt=media&token=d90bf2a1-83fb-42d9-a74e-8422c3d168f7";
        }
        return { ...user, avatar: avatarUrl };
    });

    // Insert the users data into the database
    const users = await User.insertMany(usersData);

    if (!users) {
        return next(new errorHandler('Users not inserted', 404));
    }

    res.status(200).json({
        size: users.length,
       
        success: true
    });
});

//Admin : Get All users = 
exports.getAllUsersByAdmin = CatchAsyncError(async (req, res, next) => {
    const { gender } = req.query;

    let filter = {};

    if (gender && (gender === 'male' || gender === 'female')) {
        filter.gender = gender;
    }

    const users = await User.find(filter);

    res.status(200).json({
        success: true,
        gender: gender || 'all',
        users
    });
});


//Admin : Get specific users = 
exports.getSpecificUserByAdmin = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new errorHandler(`User not found with this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Admin: Delete a specific user
exports.deleteUserByAdmin = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new errorHandler(`User not found with this id ${req.params.id}`, 404));
    }

    await user.deleteOne();  

    res.status(200).json({
        success: true,
        message: 'User has been deleted'
    });
});
