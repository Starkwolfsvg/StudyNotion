const Category = require("../models/Category");
//create tags ka handler function
exports.createCategory = async(req, res)=>{
    try{
        //data fetch
       const {name, description} = req.body;
       //data validate kro
       if(!name || !description){
            return res.status(400).json({
                success: false,
                message:"All fields are required",
            });
       }
       //create entry in db
       const categoryDetails = await Category.create({
        name:name,
        description: description,
       });
       console.log(categoryDetails);
       return res.status(200).json({
        success: true,
        message:"Category created successfully",
       });
        

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
}
//getAlltags function
exports.showAllCategories = async(req,res)=>{
    try{
        //find function, i.e get from db and show them
        const allCategories = await Category.find({},{name: true, description: true});   
        return res.status(200).json({
            success:true,
            message:"All categories fetched successfully",
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"error.message",
        });
    }
}
