const jwt= require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
//auth
exports.auth=async(req,res,next)=>{
    try{
        //extract token
        const token = req.cookies.token 
        || req.body.token 
        ||req.header("Authorisation").replace("Bearer ","");
        //if token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing",
            });
        }
        //verify the token
        try{
            const decode=jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode",decode);
            req.user=decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Invalid token",
            });
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}
//isStudent
exports.isStudent=async(req,res,next)=>{
    try{
       if(req.user.accountType!=="Student"){
        return res.status(401).json({
            success:false,
            message:"You are not authorised to access this student route",
        });
       }
       next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Something went wrong while validating the user",
        });
    }
}

//isInstructor
exports.isInstructor=async(req,res,next)=>{
    try{
       if(req.user.accountType!=="Instructor"){
        return res.status(401).json({
            success:false,
            message:"You are not authorised to access this instructor route",
        });
       }
       next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Something went wrong while validating the user",
        });
    }
}


//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try{
       if(req.user.accountType!=="Admin"){
        return res.status(401).json({
            success:false,
            message:"You are not authorised to access this admin route",
        });
       }
       next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Something went wrong while validating the user",
        });
    }
}