import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Check if no token
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token, authorization denied' 
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ 
                success: false, 
                message: 'Token is not valid' 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error in auth middleware' 
        });
    }
};

export default auth; 