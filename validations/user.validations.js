const { body } = require("express-validator");

const userRegisterValidate = [
    body("username")
        .isString()
        .withMessage("User name should be string"),
    body("account_number")
        .isString()
        .withMessage("User name should be string")
        .isLength(10),
    body("email_address")
        .isEmail()
        .withMessage("email format invalid"),
    body("identity_number")
        .isString()
        .withMessage("Gender should be string")
        .isLength(16)
        .withMessage("length should be 16"),
];

const checkUsername = [
    body("username")
        .isString()
        .withMessage("User name should be string"),
]

const checkID = [
    body("id")
        .isString()
        .withMessage("id should be string"),
]

const checkPatch = [
    body("id")
        .isString()
        .withMessage("id should be string"),
    body("identity_number")
        .isString()
        .withMessage("id should be string")
        .isLength(16)
        .withMessage("length should be 16"),
]

const checkIdentityNumber = [
    body("identity_number")
        .isString()
        .withMessage("id should be string")
        .isLength(16)
        .withMessage("length should be 16"),
]

const checkAccountNumber = [
    body("account_number")
        .isString()
        .withMessage("id should be string")
]



module.exports = {
    userRegisterValidate,
    checkUsername,
    checkID,
    checkPatch,
    checkIdentityNumber,
    checkAccountNumber

}