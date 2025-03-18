//mongoose ko use krenge, schema bnayenge
const mongoose= require("mongoose");
const userSchema = new mongoose.Scema({
    firstName: {
        type:String,
        required: true,
        trim: true,
    },
    lastName: {
        type:String,
        required: true,
        trim: true,
    },
    email: {
        type:String,
        required: true,
        trim: true,
    },
    password: {
        type:String,
        required: true,
        //trim: true,
    },
    accountType:{
        type: String,
        enum:["Admin", "Student", "Instructor"],
        required:true,
    },
    active:{
        type: Boolean,
        required:true,

    },
    approved:{
        type:String,
        required:true,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },
    courses:[// there can be many courses, hence its an array
        {
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref:"Course"
        }
    ],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,

    },
    resetPasswordExpires:{
        type:Date,
    },
    courseProgress:[{//many courses=> many course progresses
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
    }]


},
//add timestamps to the for when the document is created and last modified
{timestamps: true}
);
// now we will export this
module.exports=mongoose.model("User",userSchema);