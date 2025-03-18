const User= require("../models/User");
const mailSender = require("../utils/mailSender");
const mailSener = require("../utils/mailSender");
const bcrypt=require("bcrypt");


//resetPasswordToken: mail with link sender 
exports.resetPasswordToken =  async(req, res)=>{
    try{
        //get email from req.body
    const email=req.body.email;
    //check if email is valid and user exists or not
    const user= await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success: false,
            message:"Your email is not registered",
        });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expire time
    const updatedDetails = await User.findOneAndUpdate(
        {email:email},
        {
            token: token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },
        { new: true},
    );
    //create url and send mail containing url
    const url = 'http://localhost:3000/update-password/${token}'
    await mailSender(email,
        "Password Reset Link",
        "Password Reset Link: ${url}");
    //return response
    return res.json({
        success:true,
        message:" Mail sent successfully",
    });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Unable to send link, try again!",
        });
    }

}


//resetPassword: DB update kaam
exports.resetPassword = async(req,res)=>{

    try{
 //token, email and password will get 3 things in email
    //data fetch
    const {password, confirmPassword, token}=req.body;
    //validation
    if(password!==confirmPassword){
        return res.json({
            success: false,
            message:" Passwords donot match, try again",
        });
    }
    //get user details with the help of token
    const userDetails =  await User.findOne({token: token});
    // if noentry then itmeans invalid token or token time expired
    if(!userDetails){
        return res.json({
            success:false,
            message:"Invalid token, try again",
        });
    }
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success: false,
            message:"Time-out(Token time expired), try again",
        });
    }
    // hash the password
    
    const hashedPassword = await bcrypt.hash(password, 10);


    //password update in db
    await User.findOneAndUpdate(
        {token:token},
        {password: hashedPassword},
        {new:true},
    );
    //return response
    return res.json({
        success:true,
        message:"new Password saved in db",
    });
    
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Error while resetting password, try again later",
        });
    }
   
}