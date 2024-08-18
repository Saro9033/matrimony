const express = require('express')
const router = express.Router()
const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword,
    getUserProfile, updateProfile,
    getAllUsersByAdmin, getSpecificUserByAdmin, deleteUserByAdmin,
    getCommonUsers,
    getMatchUsers,
    insertManyUsers,
    updateUserAvatar} = require('../controllers/authController')

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

const createMulterInstance = require('../utils/multerConfig');

// Create multer instance for 'category' uploads
const upload = createMulterInstance('usersAvatar');

  
//routes for login/register users
router.route('/register').post(upload.single('avatar'),registerUser)
 router.route('/login').post(loginUser)
 router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)

 router.route('/myprofile').get(isAuthenticatedUser, getUserProfile)
 router.route('/update').put(isAuthenticatedUser,upload.single('avatar'), updateProfile)

 router.route('/update-avatar').patch(isAuthenticatedUser,upload.single('avatar'), updateUserAvatar)

 //get related users 
router.route('/getCommonUsers').get(isAuthenticatedUser,getCommonUsers)
router.route('/getMatchUsers').get(isAuthenticatedUser,getMatchUsers)
router.route('/user/:id').get(isAuthenticatedUser, getSpecificUserByAdmin)


// //Admin Routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsersByAdmin)
router.route('/insert-many').post( insertManyUsers)                             
router.route('/admin-remove/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUserByAdmin)                             


module.exports = router