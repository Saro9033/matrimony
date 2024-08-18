const express = require('express')
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const { accessChats, fetchChats } = require('../controllers/chatControllers');


router.route('/chat/:userId').post(isAuthenticatedUser, accessChats)
router.route('/chat').get(isAuthenticatedUser,fetchChats)

module.exports = router