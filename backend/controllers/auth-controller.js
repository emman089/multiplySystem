import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "../utils/generateVerificationToken.js"
import { generateJWTToken } from "../utils/generateJWTToken.js"
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../emails/email.js"
import crypto from "crypto"
import { Member } from "../models/Member.js"
import { MemberTransaction } from "../models/member-transactions.js"
import  moment from "moment"
import jwt from 'jsonwebtoken';


export const signup = async (request, response) => {
    const { firstName, lastName, email, password } = request.body;

    try {
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return response.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return response.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = generateVerificationToken();

        // Create and save the new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            verificationTokenExpiredAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        // Generate a JWT and set it in the response
 

        // Respond with user details (excluding the password)
        response.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user.toObject(),
                password: undefined, // Exclude password field
            },
        });
    } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred during signup",
        });
    }
};
export const login = async (request, response) => {
    const { email, password } = request.body;
    
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            return response.status(400).json({ success: false, message: "Invalid email" });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(400).json({ success: false, message: "Incorrect password" });
        }

        // Check if user is verified
        const isVerified = user.isVerified;

        if (!isVerified) {
            return response.status(400).json({ success: false, message: "Email not verified" });
        }

        // Generate JWT token
         generateJWTToken(response, user._id)
        response.status(200).json({
            success:true,
            message: "Login Successful",
        })
    
    } catch (error) {
        console.log(error);
        return response.status(500).json({ success: false, message: "An unexpected error occurred" });
    }
};
export const logout = (request, response) => {
    response.clearCookie("token")
    response.status(200).json({ sucess: true, messege: "Logged Out Successfully" })
}
export const verifyEmail = async (request, response) => {
    const { code } = request.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiredAt: { $gt: Date.now() }
        });

        if (!user) {
            return response.status(400).json({ success: false, message: "Incorrect code or code expired." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiredAt = undefined;
        generateJWTToken(response, user._id);
        await user.save();
        await sendWelcomeEmail(user.email, user.firstName);
        return response.status(200).json({ success: true, message: "Email verified successfully." });

    } catch (error) {
        console.error("Error verifying email:", error);
        return response.status(500).json({ success: false, message: "An error occurred while verifying the email." });
    }
};


export const forgotPassword = async (request,response) => {
const {email} = request.body;
const user = await User.findOne({email});
if(!user){
    return response.status(400).json({ sucess: false, messege:"invalid email" })
}
    const resetPasswordToken = crypto.randomBytes(32).toString("hex")
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiredAt = resetPasswordExpiresAt;

    await user.save();
await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`)
return response.status(200).json({ sucess: false, messege: "reset possword email send successfully" })
       
}
export const resetPassword = async (request, response) => {
    try {
        const { token } = request.params;
        const { password } = request.body;

        // Find user by token and ensure the token is not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiredAt: { $gt: Date.now() }, // Check expiration
        });

        if (!user) {
            return response.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiredAt = undefined;

        await user.save();

        // Send success email
        await sendResetSuccessEmail(user.email);

        return response.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            success: false,
            message: "An error occurred while resetting the password",
        });
    }
};

// Function to check authentication
export const checkAuth = async (request, response) => {
    try {
        // Get the token from the cookies
        const token = request.cookies.token;
        if (!token) {
            return response.status(401).json({
                success: false,
                message: 'Authentication token is missing.',
            });
        }

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded.userId);
        if (!user) {
            return response.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        response.status(200).json({
            success: true,
            user: { ...user._doc, password: undefined }, // Exclude the password field
        });
    } catch (error) {
        console.error('Error in checkAuth:', error);
        response.status(400).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};
export const checkMember = async (user, response) => {
    try {
        const member = await Member.findOne({ memberId:user._id})
        if(!member){
        return response.status(400).json({
                success: false,
                message: "member not found",
            });
        }
        response.status(200).json({success:true, user:{...member._doc}})
    } catch (error) {
        console.log(error)
        response.status(400).json({success:false,message: error.message}) 
    }
}


export const checkMemberTransaction = async (request, response) => {
    if (!request.userId) {
        return response.status(400).json({
            success: false,
            message: "User ID is missing from the request"
        });
    }

    try {
        // Find the user by userId
        const user = await User.findById(request.userId);
        if (!user) {
            return response.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Find all transactions for this user
        const membertrans = await MemberTransaction.find({ memberId: user._id });

        // If no transactions are found, return a proper message
        if (membertrans.length === 0) {
            return response.status(400).json({
                success: false,
                message: "No transactions found for this user"
            });
        }

        // Get the start and end time for different periods
        const startOfToday = moment().startOf('day').toDate();
        const endOfToday = moment().endOf('day').toDate();
        const startOfYesterday = moment().subtract(1, 'days').startOf('day').toDate();
        const endOfYesterday = moment().subtract(1, 'days').endOf('day').toDate();
        const startOfThisMonth = moment().startOf('month').toDate();
        const endOfThisMonth = moment().endOf('month').toDate();
        const startOfLastMonth = moment().subtract(1, 'months').startOf('month').toDate();
        const endOfLastMonth = moment().subtract(1, 'months').endOf('month').toDate();

        // Parse the transactionDate and filter based on transaction date for different periods
        const transactionsToday = membertrans.filter(transaction => {
            const transactionDate = moment(transaction.transactionDate, 'M/D/YYYY').toDate();
            return transactionDate >= startOfToday && transactionDate <= endOfToday;
        });

        const transactionsYesterday = membertrans.filter(transaction => {
            const transactionDate = moment(transaction.transactionDate, 'M/D/YYYY').toDate();
            return transactionDate >= startOfYesterday && transactionDate <= endOfYesterday;
        });

        const transactionsThisMonth = membertrans.filter(transaction => {
            const transactionDate = moment(transaction.transactionDate, 'M/D/YYYY').toDate();
            return transactionDate >= startOfThisMonth && transactionDate <= endOfThisMonth;
        });

        const transactionsLastMonth = membertrans.filter(transaction => {
            const transactionDate = moment(transaction.transactionDate, 'M/D/YYYY').toDate();
            return transactionDate >= startOfLastMonth && transactionDate <= endOfLastMonth;
        });

        // Calculate totals
        const totalAmount = membertrans.reduce((acc, transaction) => acc + transaction.total, 0);
        const totalIncomeYesterday = transactionsYesterday.reduce((acc, transaction) => acc + transaction.total, 0);
        const totalIncomeToday = transactionsToday.reduce((acc, transaction) => acc + transaction.total, 0);
        const totalIncomeThisMonth = transactionsThisMonth.reduce((acc, transaction) => acc + transaction.total, 0);
        const totalIncomeLastMonth = transactionsLastMonth.reduce((acc, transaction) => acc + transaction.total, 0);

        // Number of transactions today
        const numberOfTransactionsToday = transactionsToday.length;

        response.status(200).json({
            success: true,
            user: membertrans, 
            total: totalAmount, // Total for all transactions
            totalIncomeYesterday: totalIncomeYesterday, // Total for yesterday
            totalIncomeToday: totalIncomeToday, // Total for today
            totalIncomeThisMonth: totalIncomeThisMonth, // Total for this month
            totalIncomeLastMonth: totalIncomeLastMonth, // Total for last month
            numberOfTransactionsToday: numberOfTransactionsToday // Number of transactions made today
        });

    } catch (error) {
        console.log(error);
        response.status(400).json({
            success: false,
            message: error.message
        });
    }
};

