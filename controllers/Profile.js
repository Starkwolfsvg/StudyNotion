const Profile = require("../models/Profile");
const User = require("../models/User");
exports.updateProfile = async(req, res)=>{
    try{
        //fetch data and userID
        const {dateOfBirth="", about="", contactNumer, gender}=req.body;
        const id=req.user.id;
        //data validation
        if(!contactNumber|| !gender || !id){
            return req.status(402).json({
                success: false,
                message: "all data feilds are mandatory",
            })
        }
        //find the profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetials;
        const profileDetails = await Profile.findById(profileId);
        
        //update the profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about  = about;
        profileDetails.gender  = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message:"Profile updated successfully",
            profileDetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error, cant update profile",
            error: error.message,
        });
    }
};

//deleteaccount
//todo: cronjob
//also give some timer before deleting the account, like 5 days
exports.deleteAccount=async(req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation id
        const userDetails= await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message:"Could not fetch user details",
            });
        }
        //user profile delete karo
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetials});
        // todo:un- enroll user from all enrolled courses
        //user delete
        await User.findByIdAndDelete({_id:id});
        //return response
        return res.status(200).json({
            sucess:true,
            message:"Acccount deleted successfully",
        });
         
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete user account, try again later",
        });
    }
}
exports.getAllUserDetials = async(req,res)=>{
    try{
        //get id
        const id=req.user.id;
        //get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //validation
        //return response
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:"unable to fetch data, internal error",
            error: error.message,
        });

    }
}