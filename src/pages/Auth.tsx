import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Auth: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get the mode (login/signup) and any saved comparison data
    const mode = searchParams.get('mode') || 'login';
    const isSignup = mode === 'signup';
    
    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLoginSuccess = () => {
        // After successful login/signup
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
            {isSignup ? (
                <SignupForm onSuccess={handleLoginSuccess} />
            ) : (
                <LoginForm onSuccess={handleLoginSuccess} />
            )}
            {/* Only show the switch option when explicitly on the auth page */}
            {window.location.pathname === '/auth' && (
                <div className="auth-switch">
                    {isSignup ? (
                        <p>
                            Already have an account?{' '}
                            <Link to="/auth?mode=login">Login here</Link>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{' '}
                            <Link to="/auth?mode=signup">Sign up here</Link>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

const SignupForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [formData, setFormData] = useState(() => {
        // Check for saved comparison data
        const savedData = localStorage.getItem('tempCompareData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            return {
                username: '',
                email: '',
                password: '',
                fullName: parsedData.fullName || '',
                age: parsedData.age || '',
                // ... other fields
            };
        }
        return {
            username: '',
            email: '',
            password: '',
            fullName: '',
            age: ''
        };
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ... signup logic ...

            // After successful signup, clear the temporary data
            localStorage.removeItem('tempCompareData');

            // Redirect to compare page or dashboard
            onSuccess();
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    // ... rest of the component logic

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Age</label>
                <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="0"
                    required
                />
            </div>
            {/* ... other fields ... */}
        </form>
    );
};

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
    // ... Login form implementation ...
};

export default Auth; 