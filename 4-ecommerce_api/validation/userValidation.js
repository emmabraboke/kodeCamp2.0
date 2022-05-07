const joi = require("joi")


const validation = (user)=>{
    const validationSchema = joi.object({
        firstName : joi.string()
        .min(3)
        .max(20)
        .required(),

        lastName : joi.string()
        .min(3)
        .max(20)
        .required(),

        email : joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),

        password: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }).unknown()

    return validationSchema.validate(user)
}


module.exports = validation