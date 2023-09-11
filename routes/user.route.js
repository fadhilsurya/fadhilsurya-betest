const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { RegisterUser, GetJwtTokenByUsername,
    GetByUsername, UpdateIdentityNumber,
    DeleteByID, GetUsers,
    GetByAccountNumber, GetByIdentityNumber
} = require('../handler/user.handler')
const { userRegisterValidate, checkUsername,
    checkID, checkPatch,
    checkAccountNumber, checkIdentityNumber } = require('../validations/user.validations')
const { authenticateJWT } = require('../middleware/auth')

// public routes
router.post('/', userRegisterValidate, RegisterUser)
router.post('/assign', GetJwtTokenByUsername)

// private route need jwt in the headers
router.use(authenticateJWT)
router.get('/', GetUsers)

router.get('/one', checkUsername, GetByUsername)
router.get('/one/identity-number', checkIdentityNumber, GetByIdentityNumber)
router.get('/one/account-number', checkAccountNumber, GetByAccountNumber)
router.patch('/modify/identity', checkPatch, UpdateIdentityNumber)
router.delete('/remove/one', checkID, DeleteByID)


module.exports = router 