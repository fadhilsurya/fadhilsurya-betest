
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

function signData(data) {
    return jwt.sign(data, process.env.JWTTOKEN)
}

function decodeData(data) {
    return jwt.decode(data, process.env.JWTTOKEN)
}

module.exports = {
    signData,
    decodeData
}