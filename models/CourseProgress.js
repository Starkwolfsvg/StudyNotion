//mongoose ko use krenge, schema bnayenge
const mongoose= require("mongoose");
const courseProgress = new mongoose.Scema({
    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos:[{// many videos can be completed hence we use array
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
    }]

});
// now we will export this
module.exports=mongoose.model("CourseProgress",courseProgress);