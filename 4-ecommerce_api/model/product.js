const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    dateCreated:{
        type: Date,
        default: Date.now
    }

})

module.exports= mongoose.model("Products", ProductSchema)