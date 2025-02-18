import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, CreditCard, Calendar, Shield } from 'lucide-react';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas } from '../utils/formatNumber';

const Profile: React.FC = () => {
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        age: '',
        panCard: '',
        aadharNumber: '',
        occupation: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [comparisonData, setComparisonData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [profileRes, comparisonRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/user/details', {
                        headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    axios.get('http://localhost:5000/api/user/latest-comparison', {
                        headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                if (profileRes.data?.success) {
                    const { profile, email } = profileRes.data.user;
                    
                    // Make sure we're getting all fields
                    const updatedProfile = {
                        fullName: profile.fullName || '',
                        email: email || '',
                        phone: profile.phone || '',
                        address: profile.address || '',
                        dateOfBirth: profile.dateOfBirth || '',
                        age: profile.age?.toString() || '',
                        panCard: profile.panCard || '',
                        aadharNumber: profile.aadharNumber || '',
                        occupation: profile.occupation || ''
                    };

                    console.log('Setting profile state:', updatedProfile);
                    setUserProfile(updatedProfile);
                }

                if (comparisonRes.data?.success) {
                    setComparisonData(comparisonRes.data.comparison);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Log the data we're sending
            console.log('Sending profile data:', { profile: userProfile });

            const response = await axios.post(
                'http://localhost:5000/api/user/details',
                { 
                    profile: {
                        fullName: userProfile.fullName,
                        phone: userProfile.phone,
                        address: userProfile.address,
                        dateOfBirth: userProfile.dateOfBirth,
                        age: userProfile.age,
                        panCard: userProfile.panCard,
                        aadharNumber: userProfile.aadharNumber,
                        occupation: userProfile.occupation
                    }
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Server response:', response.data); // Debug log

            if (response.data?.success) {
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                // Refresh the profile data
                await fetchUserData();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    return (
        <div className="profile-container">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="profile-header">
                <div className="profile-avatar">
                    <User size={64} />
                </div>
                <h1>{userProfile.fullName || 'Complete Your Profile'}</h1>
                <button 
                    className="edit-button"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-section personal-info">
                    <h2>Personal Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <User className="info-icon" />
                            <div>
                                <h3>Full Name</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userProfile.fullName}
                                        onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
                                    />
                                ) : (
                                    <p>{userProfile.fullName || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <Mail className="info-icon" />
                            <div>
                                <h3>Email</h3>
                                <p>{userProfile.email || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Phone className="info-icon" />
                            <div>
                                <h3>Phone</h3>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={userProfile.phone}
                                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                                    />
                                ) : (
                                    <p>{userProfile.phone || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <MapPin className="info-icon" />
                            <div>
                                <h3>Address</h3>
                                {isEditing ? (
                                    <textarea
                                        value={userProfile.address}
                                        onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                                    />
                                ) : (
                                    <p>{userProfile.address || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <Calendar className="info-icon" />
                            <div>
                                <h3>Date of Birth</h3>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={userProfile.dateOfBirth}
                                        onChange={(e) => setUserProfile({...userProfile, dateOfBirth: e.target.value})}
                                    />
                                ) : (
                                    <p>{userProfile.dateOfBirth || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <Briefcase className="info-icon" />
                            <div>
                                <h3>Occupation</h3>
                                {isEditing ? (
                                    <select
                                        value={userProfile.occupation}
                                        onChange={(e) => setUserProfile({...userProfile, occupation: e.target.value})}
                                    >
                                        <option value="">Select Occupation</option>
                                        <option value="salaried">Salaried</option>
                                        <option value="self-employed">Self Employed</option>
                                        <option value="business">Business Owner</option>
                                        <option value="student">Student</option>
                                        <option value="retired">Retired</option>
                                    </select>
                                ) : (
                                    <p>{userProfile.occupation || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-section documents">
                    <h2>Documents & Verification</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <CreditCard className="info-icon" />
                            <div>
                                <h3>PAN Card</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userProfile.panCard}
                                        onChange={(e) => setUserProfile({...userProfile, panCard: e.target.value})}
                                    />
                                ) : (
                                    <p>{userProfile.panCard || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <Shield className="info-icon" />
                            <div>
                                <h3>Aadhar Number</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userProfile.aadharNumber}
                                        onChange={(e) => setUserProfile({...userProfile, aadharNumber: e.target.value})}
                                    />
                                ) : (
                                    <p>{userProfile.aadharNumber || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="profile-actions">
                        <button 
                            className="save-button"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                {comparisonData && (
                    <div className="profile-section comparison-info">
                        <h2>Latest Loan Comparison</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <div>
                                    <h3>Credit Score</h3>
                                    <p>{comparisonData.creditScore}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <h3>Annual Income</h3>
                                    <p>₹{comparisonData.formData.annualIncome ? 
                                        formatNumberWithCommas(comparisonData.formData.annualIncome) : 
                                        'Not provided'}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <h3>Employment Type</h3>
                                    <p>{comparisonData.formData.employmentType}</p>
                                </div>
                            </div>
                            {/* Add more comparison details as needed */}
                        </div>
                        <button 
                            onClick={() => navigate('/loan-eligibility')}
                            className="view-eligibility-button"
                        >
                            View Loan Eligibility
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 