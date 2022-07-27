const {decodeToken} = require('../utils/auth')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token provided')
    }
    //get only the token
    const token = authHeader.split(' ')[1]
    try {
        const decoded = decodeToken(token)
        const {userId, name } = decoded
        //add req params
        req.user = {userId, name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invalid Token')
    }
}

module.exports = authenticationMiddleware
