const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler");
const { error } = require("console");

const validateToken = asyncHandler(async(req, res, next)=>{
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
    }
    else if(req.cookies){
        token = req.cookies.token
    }
    if(!token){
        res.status(401);
        throw new Error("Access token is missing!");
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
        if(err){
            res.status(401);
            throw new Error("User is not authorized!  Please Sign-in first!")
        }
        req.user = decoded.user;
        next();
    })
})

module.exports = validateToken