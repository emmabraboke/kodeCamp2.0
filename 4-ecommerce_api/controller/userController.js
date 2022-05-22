const Users = require("../model/user")
const validation = require("../validation/userValidation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebToken")


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

const login = async (req,res) =>{
    const {email, password} = req.body
  try {
    if(!email){
       return res.status(400).json("Provide email and password")
    }

    if(!password){
        return res.status(400).json("Provide email and password")
    }

    const user = await Users.findOne({email})
    
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
       return res.status(400).json("invalid credentials")
    }
    
    const payload = {id: user._id, role: user.role}
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn : "15m"})
    const refreshToken =  jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn : "1d"})


    user.refreshToken = refreshToken
    await user.save()
    
    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        maxAge: 60*60*24*1000
    })

    res.status(200).json({accessToken})
  } catch (error) {
         res.status(401).json("invalid credentials")
      
  }
    
}

const refresh = async (req,res)=>{
   try {
    const refreshToken = req.cookies.refreshToken
   
    if(!refreshToken){
       return res.status(401).json("invalid credentials")
    }

    const user = await Users.findOne({refreshToken})

    if(!user){
       return res.status(401).json("invalid credentials")
    }

    const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)

    if(user._id.toString()!== verifyToken.id){
        return res.status(401).json("invalid credentials")
    }

    const payload = {id: user._id, role: user.role}
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn : "15m"})

    res.status(200).json({accessToken})
   } catch (error) {
    res.status(401).json("invalid credentials")
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
    login,
    refresh,
    getUser,
    updateUser,
    updatePassword,
    deleteUser
}
