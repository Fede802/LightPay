const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddelware = (err, req, res, next) => { 
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
}

module.exports = errorHandlerMiddelware