const Products = require("../model/product")
const productValidation = require("../validation/productValidation")

const getProducts = async(req,res)=>{
    try {
        const products = await Products.find({}).sort("price")
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const getProductsQuery = async(req,res)=>{
    try {
        const products = await Products.find({}).sort('price').select("name category")
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const createProduct =async(req,res) =>{
    try {

        const {error} = productValidation(req.body)

        if(error){
            return res.status(400).json(error.details[0].message)
        }

        const product = await Products.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const getProduct = async(req,res) =>{
    try {
        const {id: productId} = req.params
        const product = await Products.findOne({_id:productId})

        if(!product){
           return res.status(404).send(`product with id ${productId} not found`)
        }

        res.status(200).json(product)

    } catch (error) {
        res.json(error)
    }
}

const updateProduct = async(req,res) =>{
    try {
        const {id: productId} = req.params
        const product = await Products.findOneAndUpdate({_id:productId},req.body,{runValidators:true, new:true})
        
        if(!product){
            return res.status(404).send(`product with id ${productId} not found`)
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async(req,res) =>{
    try {
        const {id: productId} = req.params
        const product = await Products.findOneAndDelete({_id:productId})
        
        if(!product){
            return res.status(404).send(`product with id ${productId} not found`)
        }
        res.status(200).json()
        
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsQuery
}