const express = require('express')
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const { sendMessage, allMessages } = require('../controllers/messageController');


router.route('/send-msg').post(isAuthenticatedUser, sendMessage)
router.route('/all-msg/:chatId').get(isAuthenticatedUser,allMessages)

module.exports = router