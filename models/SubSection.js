//mongoose ko use krenge, schema bnayenge
const mongoose= require("mongoose");
const subSectionSchema = new mongoose.Scema({
    title:{
        type:String,
    },
    timeDuration:{
        type: String,
    },
    description:{
        type: String,
    },
    videoURL:{
        type:String,
    },

});
// now we will export this
module.exports=mongoose.model("SubSection",subSectionSchema);