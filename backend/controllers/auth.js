const idGen = require('uuid')
const {registerSchema, loginSchema} = require('../model/schema')
const { StatusCodes } = require('http-status-codes')
const {createToken, encryptPsw, checkPsw} = require('../utils/auth')
const {addUser, checkUser, connectUser} = require('../db/usersManager')



const register = async (req, res) => {
    try {
        //check data from client
        let user = await registerSchema.validateAsync(req.body)
        //generate and assign a userID
        let id = idGen.v4().replace(/-/g, '')
        user.id = id
        //encrypt user password field
        await encryptPsw(user)
        //create jwt token from {userId, name}
        let token = createToken(user)
        await addUser(user)
        res.status(StatusCodes.CREATED).json({ token })
    } catch (error) {
            if(error.isJoi)
            error.status = StatusCodes.PARTIAL_CONTENT
            throw error
    }
}
const login = async (req, res) => {
    try {
        let user = await loginSchema.validateAsync(req.body)
        let {id, psw} = checkUser(user.name)
        user.id = id
        await checkPsw(user.password,psw)
        await connectUser(id)
        //create jwt token from {userId, name}
        let token = createToken(user)
        res.status(StatusCodes.OK).json({ token })
    
    } catch (error) {
            if(error.isJoi)
            error.status = StatusCodes.PARTIAL_CONTENT
            throw error
    }
}
    
module.exports = { 
    register, 
    login 
}