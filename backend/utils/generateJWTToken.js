import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateJWTToken = (response, userId) => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        const token = jwt.sign({ userId }, process.env.JWT_KEY, {
            expiresIn: '1d'
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return token;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Failed to generate token');
    }
};
