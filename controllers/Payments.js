const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollementEmial} = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and intiate the razorpay order
exports.capturePayment = async(req,res)=>{
    //getcourse id and user id
    const {course_id}= req.body;
    const userId = req.user.id;
    //validation

    //validate user id
    if(!course_id){
        return res.json({
            success: false,
            message: "please provide valid course id",
        });
    }
    //validate course id
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: " could not find the course",
            });
        }
        //user already paid or not
        //user id ko string se object id mai convert kro
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "User already enrolled in this course",

            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message:" Internal server error while validating data",
        });
    }
    
    //order create 
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount: amount*100,
        currency: currency,
        receipt: Math.random(Date.now()).toString,
        notes:{
            courseId: course_id,
            userId,
        },
    };

    try{
        //initate the payment using razorpay
        const paymentResponse  = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    }
    catch(error){
        console.log(error)l
        return res.json({
            success: false,
            message:"Could not initiate the order",
        });
    }
    


};
//verify signature handler function for razorpay and server


