const express = require("express")
const route = express.Router()

const {
    getProducts,
    getProductsQuery,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controller/productController")

route.get("/", getProducts)
route.get("/query", getProductsQuery)
route.post("/",createProduct)
route.get("/:id",getProduct)
route.patch("/:id",updateProduct)
route.delete("/:id",deleteProduct)

module.exports = route