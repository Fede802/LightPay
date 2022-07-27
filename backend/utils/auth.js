const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {BadRequestError} = require('../errors')

const createToken = (userData) => {
    return jwt.sign(
        { userId: userData.id, name: userData.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        })
}
const decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}
const encryptPsw = async (user)=>{
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
}
const checkPsw = async (password, userpassword)=>{
    const isCorrect = await bcrypt.compare(password, userpassword)
    if(!isCorrect)
        throw new BadRequestError("Incorrect username or password")
}

module.exports = { 
    createToken, 
    encryptPsw, 
    checkPsw, 
    decodeToken
}