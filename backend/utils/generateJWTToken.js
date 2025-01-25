export const generateJWTToken = (response, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });

    response.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' 
            ? 'https://multiplysystem.onrender.com'  // Adjust to your actual domain
            : 'localhost',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
};
