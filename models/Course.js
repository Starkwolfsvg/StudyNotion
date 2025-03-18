const mongoose=require("mongoose");

const courseSchema= new mongoose.Schema({
    courseName:{
        type:String,
        trim: true,
        required: true,
    },
    courseDescription:{
        type:String,
        trim: true,
        required: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type: String,
    },
    courseContent:[// course content has multiple (array) sections
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],
    price:{
        type: Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }],
    instructions:{
        type:[String],
        required:true,
    },
    status:{
        type:String,
        enum:["Draft","published"],
    },
});
module.exports = mongoose.model("Course",courseSchema);