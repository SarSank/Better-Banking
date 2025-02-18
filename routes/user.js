import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/details', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                profile: user.profile,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Update user profile
router.post('/details', auth, async (req, res) => {
    try {
        const { profile } = req.body;
        
        // Log the received data
        console.log('Received profile update:', profile);

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update all profile fields
        user.profile = {
            ...user.profile,
            fullName: profile.fullName,
            phone: profile.phone,
            address: profile.address,
            dateOfBirth: profile.dateOfBirth,
            age: profile.age,
            panCard: profile.panCard,
            aadharNumber: profile.aadharNumber,
            occupation: profile.occupation
        };

        await user.save();

        // Send back the updated user data
        res.json({
            success: true,
            user: {
                email: user.email,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save comparison data
router.post('/comparison', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Add comparison to user's history
        user.comparisons.unshift({
            formData: req.body.formData,
            creditScore: req.body.creditScore,
            eligibility: req.body.eligibility,
            date: new Date()
        });

        await user.save();

        res.json({ success: true, message: 'Comparison saved successfully' });
    } catch (error) {
        console.error('Error saving comparison:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get latest comparison
router.get('/latest-comparison', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.comparisons.length) {
            return res.json({ success: true, comparison: null });
        }

        res.json({ 
            success: true, 
            comparison: user.comparisons[0] 
        });
    } catch (error) {
        console.error('Error fetching comparison:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router; 