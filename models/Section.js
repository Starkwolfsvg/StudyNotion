//mongoose ko use krenge, schema bnayenge
const mongoose= require("mongoose");
const sectionSchema = new mongoose.Scema({
    sectionName:{
        type:String,
    },
    subSection:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "SeubSection",
        }
    ],

});
// now we will export this
module.exports=mongoose.model("Section",sectionSchema);