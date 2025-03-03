import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    email: {
    type: String,
    required: true,
    },
    password: {
    type: String,
    required: true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    resetPasswordToken:String,
    resetPasswordExpiredAt:Date,
    verificationToken:String,
    verificationTokenExpiredAt:Date,
})

export const User = mongoose.model('User',userSchema)