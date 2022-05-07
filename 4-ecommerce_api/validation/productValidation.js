const joi = require("joi")


const validation = (product)=>{
    const validationSchema = joi.object({
        name : joi.string()
        .min(3)
        .max(20)
        .required(),

        description : joi.string()
        .min(3)
        .max(20)
        .required(),

        category : joi.string()
        .min(3)
        .max(20)
        .required(),

        price : joi.number()
        .required(),

    }).unknown()

    return validationSchema.validate(product)
}


module.exports = validation