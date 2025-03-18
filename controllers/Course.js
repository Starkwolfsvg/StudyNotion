const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course
exports.createCourse= async(req, res)=>{
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName ||! courseDescription||!whatYouWillLearn||!price ||!tag ||!thumbnail){
            return res.status(400).json({
                success: false,
                message: 'All fields are mandatory',
            });
        }
        //check for instructor
        const userId= req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor details: ", instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message:"unable to fetch instructor details",
            });
        }
        //check if given tag is valid or not
        const tagDetails= await Tag.findById(tag); 
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message:"unable to fetch tag details",
            });
        }
        const thumbnailImage  = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        //create entry for new course
        const newCourse =await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail: thumbnailImage.secure_url,

        });
        // add the new course to the user schema of the instructor
        await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id
            },
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true}, 
        );
        //update the Tag schema

        //return response
        return res.status(200).json({
            success: true,
            message:"New course created successfully",
            data:newCourse,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Failed to create new course",
            error: error.message,
        });

    }
}

//getAllCourses handler function
exports.showAllCourses = async(req,res)=>{
    try{
        //todo: change the below sgatement incrementally
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail: true,
            instrucotr: true,
            studentsEnrolled: true,
        }).populate("instructor")
        .exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses found successfully",
            data:allCourses,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to show all the courses details",
            error:error.message,
        });
    }
}