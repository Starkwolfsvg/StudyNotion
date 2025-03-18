//mongoose ko use krenge, schema bnayenge
const mongoose= require("mongoose");
const profileSchema = new mongoose.Scema({
    gender:{
        type: String,
    },
    dateOfBirtth:{
        type: String,
    },
    about:{
        type: String,
        trim: true,
    },
    contactNumber:{
        type: Number,
        trim: true,
    }

});
// now we will export this
module.exports=mongoose.model("Profile",profileSchema);