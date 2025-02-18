import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password,
            fullName,
            age,
            cityRegion,
            annualIncome,
            totalLoanAmount,
            monthlyEMI,
            avgCreditCardUsage,
            oldestLoanAge,
            emiPaymentHistory,
            loanRejection,
            employmentType,
            yearsInCurrentJob,
            recentLoanApplications
        } = req.body;

        // Log the request body
        console.log('Signup request:', { username, email });

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Create new user
        user = new User({
            username,
            email,
            password,
            profile: {
                fullName,
                age,
                cityRegion,
                annualIncome,
                totalLoanAmount,
                monthlyEMI,
                avgCreditCardUsage,
                oldestLoanAge,
                emiPaymentHistory,
                loanRejection,
                employmentType,
                yearsInCurrentJob,
                recentLoanApplications
            }
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT Error:', err);
                    throw err;
                }
                res.json({ 
                    success: true,
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        profile: user.profile
                    }
                });
            }
        );
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    success: true,
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        profile: user.profile
                    }
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

export default router; 