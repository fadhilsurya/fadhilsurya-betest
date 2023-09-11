const jwtHelper = require('../helper/jwt')
const User = require('../models/user')
const { getById } = require('../handler/user.handler')
module.exports = {

    async authenticateJWT(req, res, next) {

        if (req.headers.authorization == null) {
            return res.status(400).json({
                message: 'bad request authorization invalid',
                data: null,
                error: null
            })
        }

        const dataUser = await jwtHelper.decodeData(req.headers.authorization)
        req.body.user_id = dataUser.id
        // check if user is existing or not or not
        let respUser = await getById(req.body.user_id)
        if (respUser == null) {
            return res.status(422).json({
                message: 'User Not Found',
                data: null,
                error: null
            })
        }


        next()
    }



}