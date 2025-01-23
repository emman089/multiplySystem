import { MemberTransaction } from '../models/member-transactions.js';
import { Member } from '../models/Member.js';


export const createMember = async (request, response) => {
    const {
        memberID,
        referralCode,
        memberType,
        addressNo,
        province,
        city,
        barangay,
        role = "Member",
        memberStatus = "Pending",
        paymentType,
        referredBy,
        memberDate,
        transactionId = "",
        productName = "",
        productImage = "",
        quantity = 0,
        price = 0,
        total = 100,
        paymentMethod = "",
        transactionDate = ""
    } = request.body;
    try {
        // Validate required fields
        if (!referralCode || !memberID || !memberType || !addressNo || !province || !city || !barangay || !paymentType || !memberDate) {
            return response.status(400).json({ 
                success: false, 
                message: "All required fields must be provided" 
            });
        }
         const member = new Member({
            memberID,
            referralCode,
            memberType,
            addressNo,
            province,
            city,
            barangay,
            role,
            memberStatus,
            paymentType,
            referredBy,
            memberDate,
        });
         const memberTransaction = new MemberTransaction({
            memberId: memberID,
            transactionId,
            productName,
            productImage,
            quantity,
            price,
            total,
            paymentMethod,
            transactionDate
        });

        await member.save();
        await memberTransaction.save();

        response.status(201).json({
            success: true,
            message: "Member created successfully",
            member: member
        });

    } catch (error) {
        console.error(`Error creating member: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred while creating member"
        });
    }
};

export const getAllMembers = async (request, response) => {
    try {
        const members = await Member.find();
        response.status(200).json({
            success: true,
            members
        });
    } catch (error) {
        console.error(`Error fetching members: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred while fetching members"
        });
    }
};

export const getMemberById = async (request, response) => {
    try {
        const member = await Member.findOne({ memberID: request.params.memberID });
        
        if (!member) {
            return response.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        response.status(200).json({
            success: true,
            member
        });
    } catch (error) {
        console.error(`Error fetching member: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred while fetching member"
        });
    }
};

export const updateMember = async (request, response) => {
    try {
        const {
            memberType,
            addressNo,
            province,
            city,
            barangay,
            paymentType,
            referralCode
        } = request.body;

        // Check if user exists and is authenticated
        const user = await User.findById(request.userId);
        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found or unauthorized"
            });
        }

        const member = await Member.findOneAndUpdate(
            { memberID: request.params.memberID, userId: request.userId },
            {
                memberType,
                addressNo,
                province,
                city,
                barangay,
                paymentType,
                referralCode
            },
            { new: true, runValidators: true }
        );

        if (!member) {
            return response.status(404).json({
                success: false,
                message: "Member not found or unauthorized"
            });
        }

        response.status(200).json({
            success: true,
            message: "Member updated successfully",
            member
        });
    } catch (error) {
        console.error(`Error updating member: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred while updating member"
        });
    }
};

export const deleteMember = async (request, response) => {
    try {
        // Check if user exists and is authenticated
        const user = await User.findById(request.userId);
        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found or unauthorized"
            });
        }

        const member = await Member.findOneAndDelete({ 
            memberID: request.params.memberID,
            userId: request.userId 
        });

        if (!member) {
            return response.status(404).json({
                success: false,
                message: "Member not found or unauthorized"
            });
        }

        response.status(200).json({
            success: true,
            message: "Member deleted successfully"
        });
    } catch (error) {
        console.error(`Error deleting member: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred while deleting member"
        });
    }
};

export const getMembersByType = async (request, response) => {
    try {
        const members = await Member.find({ 
            memberType: request.params.memberType,
            userId: request.userId 
        });

        response.status(200).json({
            success: true,
            members
        });
    } catch (error) {
        console.error(`Error fetching members by type: ${error.message}`);
        response.status(500).json({
            success: false,
            message: "An error occurred while fetching members"
        });
    }
};

// export const searchMembers = async (request, response) => {
//     try {
//         const { query } = request.query;
        
//         const members = await Member.find({
//             userId: request.userId,
//             $or: [
//                 { memberID: { $regex: query, $options: 'i' } },
//                 { province: { $regex: query, $options: 'i' } },
//                 { city: { $regex: query, $options: 'i' } },
//                 { barangay: { $regex: query, $options: 'i' } }
//             ]
//         });

//         response.status(200).json({
//             success: true,
//             members
//         });
//     } catch (error) {
//         console.error(`Error searching members: ${error.message}`);
//         response.status(500).json({
//             success: false,
//             message: "An error occurred while searching members"
//         });
//     }
// };