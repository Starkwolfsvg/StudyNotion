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
        console.log(error);
        return res.json({
            success: false,
            message:"Could not initiate the order",
        });
    }
    


};
//verify signature handler function for razorpay and server

exports.verifySignature = async(req,res)=>{
    const webhookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];
    //razorpay sends the hashed secret, we hash our webhooksecret
    //to seee if they both match
    //use crypto package, use HMAC and SHA512
    const shasum = crypto.createHmac("sha1", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    //match the signature and digest
    if(signature==digest){
        console.log("Payment is authorized");
        //course id and user id from notes
        const{courseId, userId} = req.body.payload.payment.entity.notes; 
        try{
            //fulfill the action
            //find the course to which he paid for and enroll in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {id:courseId},
                {$push:{studentsEnrolled: userId}},
                {new: true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    sucess: false,
                    message: "Course not found, internal error",
                });
            }

            console.log(enrolledCourse);

            //find the student and update his list of enrolled courses
            const enrolledStudent = await user.findOneAndUpdate(
                {_id:studentId},
                {$push:{courses:courseId}},
                {new:true},
            )
            console.log(enrolledStudent);

            //send mail to confirm the student's registration using mailsender
            //TODO: this has to be updated according to template
            const emialResponse  =await mailSender(
                enrolledStudent.email,
                "Congratulations",
                "Congratulations, you are registered in the course",

            );
            console.log(emialResponse);
            return res.status(200).json({
                success: true,
                message:"Signature verified and course added",
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message: error.message,
            })
        }
    }

    else{
        return res.status(400).json({
            success: false,
            message: "Invalid signature",
        });
    }
};