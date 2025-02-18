import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuthModal.css';
import LoginForm from './LoginForm';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

interface FormData {
    username: string;
    email: string;
    password: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: ''
    });

    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        // Test server connection
        const testConnection = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/health');
                console.log('Server connection test:', response.data);
            } catch (error) {
                console.error('Server connection test failed:', error);
            }
        };
        
        testConnection();
    }, []);

    // Form validation
    const validateForm = (): boolean => {
        if (!formData.email || !formData.password) {
            setMessage('Please fill in all required fields');
            return false;
        }
        if (!isLoginTab && !formData.username) {
            setMessage('Username is required for signup');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setMessage('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage(''); // Clear error message when user types
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const endpoint = isLoginTab ? 'login' : 'signup';
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/${endpoint}`,
                {
                    ...(isLoginTab ? {} : { username: formData.username }),
                    email: formData.email,
                    password: formData.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
                setMessage(`${isLoginTab ? 'Login' : 'Signup'} successful!`);
                onLoginSuccess();
            }
        } catch (error) {
            console.error('Auth error:', error);
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || `${isLoginTab ? 'Login' : 'Signup'} failed`);
            } else {
                setMessage('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal">
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <div className="tabs">
                    <div 
                        className={`tab ${isLoginTab ? 'active' : ''}`}
                        onClick={() => {
                            setIsLoginTab(true);
                            setMessage('');
                        }}
                    >
                        Login
                    </div>
                    <div 
                        className={`tab ${!isLoginTab ? 'active' : ''}`}
                        onClick={() => {
                            setIsLoginTab(false);
                            setMessage('');
                        }}
                    >
                        Sign Up
                    </div>
                </div>

                <form onSubmit={handleAuth} className="form-container">
                    {!isLoginTab && (
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                required 
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isLoginTab ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                {message && (
                    <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <LoginForm onSuccess={onLoginSuccess} />
            </div>
        </div>
    );
};

export default AuthModal; 