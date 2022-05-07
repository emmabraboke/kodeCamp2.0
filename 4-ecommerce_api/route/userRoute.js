const express = require("express")
const route = express.Router()

const {

    getUsers,
    register,
    getUser,
    updateUser,
    updatePassword,
    deleteUser

} = require("../controller/userController")

route.get("/", getUsers)
route.post("/register", register)
route.get("/:id", getUser)
route.patch("/:id", updateUser)
route.patch("/password/:id", updatePassword)
route.delete("/:id",deleteUser)

module.exports = route