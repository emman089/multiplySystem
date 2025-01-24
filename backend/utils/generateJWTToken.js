import { generateJWTToken } from './utils/generateJWTToken.js';  // Ensure this path is correct

app.post('/login', (req, res) => {
    const { userId } = req.body;  // Destructure userId from the body
    
    console.log("Received User ID:", userId);  // Check if userId is being passed correctly

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const token = generateJWTToken(res, userId);  // Pass userId to the function
        res.json({
            message: 'Token generated successfully',
            userId
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});
