const express = require("express")
const app = express()
const connect = require("./connect/product")
require("dotenv").config()

const userRoute = require("./route/userRoute")
const productRoute = require("./route/productRoute")
const cookieParser = require("cookie-parser")


//middleware
app.use(express.json())
app.use(cookieParser())

//routes
app.use(userRoute)
app.use("/product",productRoute)
app.use((req,res)=>{
    res.status(404).send("Route not found")
})

const PORT = process.env.PORT || 5000


const start = async ()=>{
    try {
        await connect(process.env.MONGO_URI) 
        console.log("database connected")
        app.listen(PORT,()=>{
            console.log(`listening on port ${PORT}...`)
        })
    } catch (error) {
        console.log(error)
    }
  

}
start()

