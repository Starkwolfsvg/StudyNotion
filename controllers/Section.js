const Section = require("../models/Section");
const Course = require("../models/Course");
exports.createSection = async(req, res)=>{
    try{
        //data fetch
        const{sectionName, courseId}=req.body;

        //data validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success: false,
                message:"All data fields could not be fetched",
            });
        }
        //section create
        const newSection  =  await Section.create({sectionName});

        //update the course with new section's object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                              {$push:{courseContent:newSection._id,}},
                                                            {new:true},);
     //todo: use populate to replace sections, subsections both in the updated course details
        //return responsse
        return res.status(200).json({
            success:true,
            message:"New section created successfully",
            updatedCourseDetails,
        });


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while creating new section",
            error: error.message,
        });

    }

}
exports.updateSection= async(req,res)=>{
    try{
        //data input
        const{sectionName,sectionId} = req.body;
        //data validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success: false,
                message:"All data fields could not be fetched",
            });
        }
        
        //update the data 
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new: true});
        return res.status(200).json({
            success: true,
            message: "section updated successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
        success:false,
        message:"Error occured while updating new section",
        error: error.message,
    });
    }
}

exports.deleteSection = async(req,res)=>{
    try{
        //get id
        const {sectionId}=req.params;
         //use findbyid and delete
         await Section.findByIdAndDelete(sectionId);
         //todo in testing: do we need to delete from the course schema too..?
         return res.status(200).json({
            success:true,
            message:"deletion successfull",
         });


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
        success:false,
        message:"Error occured while deleting new section",
        error: error.message,
    });
    }
}