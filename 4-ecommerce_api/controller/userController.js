const Users = require("../model/user")
const validation = require("../validation/userValidation")
const bcrypt = require("bcrypt")


const getUsers = async (req,res)=>{
    const user = await Users.find({})  
    res.status(200).json(user)
}

const register = async (req,res)=>{
    
    const {email,password} = req.body
    

    try {
        const {error} = validation(req.body)
    
        if(error){
            return res.status(400).json(error.details[0].message)
        }

        const isvalid = await Users.findOne({email})

        if(isvalid){
            return res.status(400).json("Email already exist")
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt)
        req.body.password= hash
        const user = await Users.create(req.body)

        const userFields = {firstName: user.firstName, lastName: user.lastName, email: user.email} 

        res.status(201).json(userFields)
    } catch (error) {
        res.status(500).json(error)
    } 
    
}

const getUser = async (req,res)=>{
    try {
        const user = await Users.findOne({_id: req.params.id})
        res.status(200).json(user)  
    } catch (error) {
        res.status(500).json(error)
    }
  
}

const updateUser = async (req,res)=>{

    try {
        const {firstName, lastName} = req.body
        const user = await Users.findOneAndUpdate({_id: req.params.id},{firstName, lastName},{runValidators:true, new:true})
        
        if(!user){
            return res.status(404).send(`user with id ${req.params.id} not found`)
        } 
        res.status(200).json("user updated")
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const updatePassword = async (req,res)=>{

    try {
        const user = await Users.findOne({_id: req.params.id}) 

        if(!user){
            return res.status(404).send(`user with id ${req.params.id} not found`)
        }
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt)
    
        user.password = hash
    
        await user.save() 
        res.status(200).json("password updated")

    } catch (error) {
        res.status(500).json(error)
    }

}
        

const deleteUser = async (req,res)=>{

    try {
        const user = await Users.findOne({_id: req.params.id})
   
        if(!user){
            return res.status(404).send(`user with id ${req.params.id} not found`)
        }
        
        await user.remove()

        res.status(200).json()

    } catch (error) {
         res.status(500).json(error)
    }
  
}

module.exports = {
    getUsers,
    register,
    getUser,
    updateUser,
    updatePassword,
    deleteUser
}
