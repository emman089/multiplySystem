import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";

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
        if (!user.isVerified) {
            return response.status(400).json({ success: false, message: "Email not verified" });
        }

        // Generate JWT token and set it in the response
        generateJWTToken(response, user._id);

        response.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return response.status(500).json({ success: false, message: "An unexpected error occurred" });
    }
};
