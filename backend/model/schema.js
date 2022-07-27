const Joi = require('joi')
const registerSchema = Joi.object({
    name: Joi.string().lowercase().required(),
    password: Joi.required(),
    ip: Joi.required(),
    port: Joi.required(),
    tls: Joi.required(),
    macaroon: Joi.required()
})

const loginSchema = Joi.object({
    name: Joi.string().lowercase().required(),
    password: Joi.required(),
})

module.exports = {registerSchema,loginSchema}