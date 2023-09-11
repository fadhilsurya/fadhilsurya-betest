const User = require('../models/user')
const jwt = require('../helper/jwt')
const redis = require("redis");


let redisClient;
let result;

redisClient = redis.createClient({
    host: 'redis', // Use the service name defined in the docker-compose.yml
    port: 6379,    // Default Redis port
});


redisClient
    .connect()
    .then(() => {
        console.log('redis connected')
    })

process.on('SIGINT', () => {
    redisClient.quit(() => {
        console.log('Redis connection closed.');
        process.exit(0);
    });
});


function RegisterUser(req, res, next) {

    return registerUser(req, res, next)
}

async function registerUser(req, res, next) {

    // check user by username to avoid double entries
    let checkUser = await getUserName(req.body.username)
    if (checkUser != null) {
        return res.status(422).json({
            message: 'user already existed',
            data: null
        })
    }

    let payload = {
        userName: req.body.username,
        accountNumber: req.body.account_number,
        emailAddress: req.body.email_address,
        identityNumber: req.body.identity_number
    }

    let registerUser = await User.create(payload)

    let keyValue = `${registerUser.userName}`

    // implementing redis insert
    await redisClient.set(keyValue, JSON.stringify(registerUser))

    res.status(200).json({
        message: 'success',
        data: registerUser,
        error: null
    })
}

async function GetByUsername(req, res) {

    const cacheResults = await redisClient.get(req.body.username);

    if (cacheResults) {
        isCached = true;
        let dataCached = JSON.parse(cacheResults);

        return res.status(200).json({
            message: 'success',
            data: dataCached,
            error: null
        })
    }



    let data = await getUserName(req.body.username)

    if (data == null) {
        return res.status(422).json({
            message: 'user not existed',
            data: null,
            error: null
        })
    }

    return res.status(200).json({
        message: 'success',
        data: data,
        error: null
    })

}

function getUserName(username) {
    return User.findOne({
        userName: username
    })
}

async function GetJwtTokenByUsername(req, res, next) {
    try {
        let data = await getUserName(req.body.username)
        if (data == null) {
            return res.status(422).json({
                message: 'user already existed',
                data: null,
                error: null
            })
        }

        let payload = {
            id: data.id,
            userName: data.userName,
            accountNumber: data.accountNumber,
            emailAddress: data.emailAddress,
            identityNumber: data.emailAddress
        }


        let dataJwt = await jwt.signData(payload)

        return res.status(200).json({
            message: 'success',
            data: dataJwt,
            error: null

        })


    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            data: null,
            error: error
        })
    }


}


function getById(id) {
    return User.findById(id)
}

function UpdateIdentityNumber(req, res) {
    return updateIdentityNumber(req, res)
}


// we want to limit what the user can update in my opinion based on the field identity number were the only one that we allow
// our client to update
async function updateIdentityNumber(req, res) {

    const filter = { id: req.body.id };
    const update = { identityNumber: req.body.identity_number };

    try {
        const doc = await User.findOneAndUpdate(filter, update, {
            new: true
        });

        let resp = await getById(req.body.id)


        return res.status(200).json({
            message: 'success',
            data: resp,
            error: null
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            data: null,
            error
        })
    }


}

function DeleteByID(req, res) {
    return deleteById(req, res)
}

async function deleteById(req, res) {

    let checkUser = await getById(req.body.id)
    if (checkUser == null) {
        return res.status(422).json({
            message: 'user already existed',
            data: null,
            error: null
        })
    }

    try {
        await checkUser.deleteOne()

        return res.status(200).json(
            {
                message: 'succeess delete user',
                data: null,
                error: null
            }
        )
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            data: null,
            error
        })

    }
}

function GetUsers(req, res) {
    return getUsers(req, res)

}

async function getUsers(req, res) {

    try {
        let users = await User.find()

        return res.status(200).json({
            message: 'success',
            data: resp,
            error: null

        })

    } catch (error) {

        return res.status(500).json({
            message: 'internal server error',
            data: null,
            error
        })

    }




}

async function GetByAccountNumber(req, res) {
    try {
        let user = await getByAccountNumber(req.body.account_number)
        if (user == null) {
            return res.status(422).json({
                message: 'user not found',
                data: null,
                error: null
            })
        }

        return res.status(200).json({
            message: 'success',
            data: user,
            error: null
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            data: null,
            error
        })
    }
}

async function getByAccountNumber(accountNumber) {
    return User.findOne({
        accountNumber
    })

}

async function GetByIdentityNumber(req, res) {
    try {
        let user = await getByIdentityNumber(req.body.identity_number)
        console.log({ user })
        if (user == null) {
            return res.status(422).json({
                message: 'user not found',
                data: null,
                error: null
            })
        }

        return res.status(200).json({
            message: 'success',
            data: user,
            error: null
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            data: null,
            error
        })
    }
}


async function getByIdentityNumber(identityNumber) {
    return User.findOne({
        identityNumber
    })

}


module.exports = {
    RegisterUser,
    GetJwtTokenByUsername,
    GetByUsername,
    UpdateIdentityNumber,
    DeleteByID,
    getById,
    GetUsers,
    GetByAccountNumber,
    GetByIdentityNumber
}