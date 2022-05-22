const express = require("express")
const route = express.Router()

const {

    getUsers,
    register,
    login,
    refresh,
    getUser,
    updateUser,
    updatePassword,
    deleteUser

} = require("../controller/userController")

const authentication = require("../middlewares/authentication")

route.get("/",getUsers)
route.post("/register",register)
route.post("/login",login)
route.get("/refresh",refresh)
route.get("/:id",authentication,getUser)
route.patch("/:id",updateUser)
route.patch("/password/:id",updatePassword)
route.delete("/:id",deleteUser)

module.exports = route