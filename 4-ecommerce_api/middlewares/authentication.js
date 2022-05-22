const authentication = (req,res,next)=>{
    
    
    if(!auth){
        res.status(401).json("Invalid credentials")
    }

    if(!auth.startsWith("Bearer ")){
        res.status(401).json("Invalid credentials")
    }

    const token = auth.split(" ")[1]

    const verifyToken = jwt.verify(token,process.env.JWT_SECRET)

    req.user = verifyToken

    next()
}

module.exports = authentication