const express = require('express')
const router = express.Router()
const userRoute = require('./user.route')


router.use('/user', userRoute)
router.get('/ping', (req, res) => {
    res.status(200).json({
        message: "pong-user"
    })
})


module.exports = router