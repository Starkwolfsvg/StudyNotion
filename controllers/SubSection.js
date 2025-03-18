const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subsection
exports.createSubSection = async(req, res)=>{
    try{
        //fetch data from req body
        const {sectionId, title, timeDuration, description}= req.body;

        //extract video file
        const video= req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration|| !description|| !video){
            return response.status(401).json({
                success: false,
                message:"All data fields are mandatory, some might be missing",

            });
        }
        //upload video to cloudinary- you will get secure URL
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create a subsection
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            video: uploadDetails.secure_url,
        });
        //update section with this subsection
        const updatedSection = await Section.findByIdAndUpdate({sectionId},
                                                                {$push:{
                                                                    subSection:SubSectionDetails._id,
                                                                }},
                                                                {new:true},
        );
        //todo: log upadated section here, after adding populate query
        //return response
        return res.status(200).json({
            success: true,
            message:"SubSection created successfully",
            updatedSection,
        });

        
    }catch(error){
        return res.status(500).json({
            success: false,
            message:"Could not create a SubSection, try again",
            error: error.message,
        });
    }
}

//todo: update Subsection
//todo: delete Subsection