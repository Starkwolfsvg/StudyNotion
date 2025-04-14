const RatingAndReview = require("../models/RatingAndReview");
const Course  = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

// 3 function
//create rating
exports.createRating  = async(req, res)=>{
    try{
        //get user id
        const userId = req.user.id
        //fetch data from req body
        const { rating, review, courseId} = req.body;
        // verify if user is enrolled or not
        const courseDetails = await Course.findOne(
            {_id:courseId,
                studentsEnrolled: {$elemMatch:{$eq:userId}},
            }
        );
        if(!courseDetails){
            return res.status(404).josn({
                success: false,
                message:"Student not enrolled in the course",
            });
        }
        //check if user has not yet rated
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyReviewed){
            return res.status(404).josn({
                success: false,
                message:"Course is already reviewed by the user",
            });
        }
        //create rating and review
        const RatingAndReview = await RatingAndReview.create({
            rating, review, user:userId, course: courseId,
        });
        //update the course with rating and review
        const updatedCourseDetials = await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews: RatingAndReview,
                }
            },
            {
                new: true,
            }
        );

        console.log(updatedCourseDetials);
        //return response
        return res.status(200).json({
            success: true,
            message:"Rating and review created successfully",
            RatingAndReview,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).josn({
            success: false,
            message:"Internal error, could not create rating and review",
        });
    }
}
//get average rating
//view all rating

