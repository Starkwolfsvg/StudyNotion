const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60,
    },

});


// this code only to be written in btween schema and module export
// a function -> to send the email that we generated using mailsender in js
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse= await mailSender(email, "Verification Email for OTP", otp );
        console.log("Mail sent successfully", mailResponse);
    }
    catch(error){
        console.log("error occured while sending OTP via mail: ",error);
        throw error;

    }
}
otpSchema.pre("save", async function(next){
    console.log("New Document saved to database");
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }  
    next();
    

});
module.exports= mongoose.model("OTP",otpSchema);