import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Award, 
    TrendingUp, 
    Landmark, 
    Car, 
    Coins,
    ChevronRight, 
    DollarSign,
    Percent,
    Calendar,
    AlertCircle,
    ArrowRight,
    Lightbulb
} from 'lucide-react';
import './LoanEligibility.css';

interface LocationState {
    creditScore: number;
    eligibility: {
        home: any;
        car: any;
        gold: any;
    };
    userData: any;
}

const LoanEligibility: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loadedState, setLoadedState] = useState<LocationState | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            // First try to get state from location
            if (location.state) {
                const state = location.state as LocationState;
                if (isValidState(state)) {
                    setLoadedState(state);
                    setIsLoading(false);
                    return;
                }
            }

            // If no location state or invalid, try localStorage
            const savedData = localStorage.getItem('comparisonData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    const stateData = {
                        creditScore: parsedData.creditScore,
                        eligibility: parsedData.eligibility,
                        userData: parsedData.formData
                    };
                    
                    if (isValidState(stateData)) {
                        setLoadedState(stateData);
                        setIsLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error parsing saved data:', error);
                }
            }

            // If no valid data found, redirect to compare
            navigate('/compare');
        };

        loadData();
    }, [location.state, navigate]);

    // Validation function
    const isValidState = (state: any): state is LocationState => {
        return (
            state &&
            typeof state.creditScore === 'number' &&
            state.eligibility &&
            state.eligibility.home &&
            state.eligibility.car &&
            state.eligibility.gold &&
            state.userData
        );
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (!loadedState || !loadedState.eligibility) {
        return <div className="error">No eligibility data found. Please try comparing again.</div>;
    }

    const { creditScore, eligibility, userData } = loadedState;

    const getCreditScoreColor = (score: number) => {
        if (score >= 750) return '#10B981'; // Green
        if (score >= 650) return '#3B82F6'; // Blue
        if (score >= 550) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    const formatAmount = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        }
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} L`;
        }
        return `₹${amount.toLocaleString()}`;
    };

    // Render loan card only if eligibility data exists
    const renderLoanCard = (type: 'home' | 'car' | 'gold') => {
        const loanData = eligibility[type];
        if (!loanData) return null;

        const handleApply = () => {
            const loanPageData = {
                creditScore,
                employmentType: userData.employmentType,
                annualIncome: userData.annualIncome,
                // Add any other relevant data from comparison
            };

            // Store the loan application data
            localStorage.setItem('loanApplicationData', JSON.stringify(loanPageData));

            switch(type) {
                case 'home':
                    navigate('/loans/home');
                    break;
                case 'car':
                    navigate('/loans/car');
                    break;
                case 'gold':
                    navigate('/loans/gold');
                    break;
            }
        };

        return (
            <div className={`loan-card ${type}`}>
                <div className="loan-header">
                    {type === 'home' && <Landmark size={24} />}
                    {type === 'car' && <Car size={24} />}
                    {type === 'gold' && <Coins size={24} />}
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Loan</h3>
                </div>
                <div className="loan-details">
                    <div className="detail-item">
                        <DollarSign size={20} />
                        <div>
                            <h4>Maximum Eligible Amount</h4>
                            <p>{formatAmount(loanData.maxEligibleAmount)}</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Percent size={20} />
                        <div>
                            <h4>Interest Rate</h4>
                            <p>{loanData.interestRate}%</p>
                        </div>
                    </div>
                </div>
                <div className="eligibility-status">
                    {loanData.isEligible ? (
                        <span className="eligible">Eligible</span>
                    ) : (
                        <span className="not-eligible">Not Eligible</span>
                    )}
                </div>
                <p>{loanData.message}</p>
                <button 
                    className="apply-button"
                    onClick={handleApply}
                >
                    Apply Now <ArrowRight size={16} />
                </button>
            </div>
        );
    };

    return (
        <div className="eligibility-container">
            <div className="credit-score-section">
                <div className="score-card">
                    <div className="score-header">
                        <Award size={32} color={getCreditScoreColor(creditScore)} />
                        <h2>Your Credit Score</h2>
                    </div>
                    <div className="score-display" style={{ color: getCreditScoreColor(creditScore) }}>
                        {creditScore}
                    </div>
                    <div className="score-scale">
                        <div className="scale-marker poor">Poor</div>
                        <div className="scale-marker fair">Fair</div>
                        <div className="scale-marker good">Good</div>
                        <div className="scale-marker excellent">Excellent</div>
                        <div 
                            className="score-indicator" 
                            style={{ 
                                left: `${(creditScore / 900) * 100}%`,
                                background: creditScore > 700 ? '#10b981' : 
                                          creditScore > 600 ? '#f59e0b' : '#ef4444'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="loan-types-grid">
                {renderLoanCard('home')}
                {renderLoanCard('car')}
                {renderLoanCard('gold')}
            </div>

            <div className="recommendations-section">
                <h3>
                    <Lightbulb />
                    Recommendations to Improve Your Score
                </h3>
                <div className="recommendations-grid">
                    {creditScore < 750 && (
                        <>
                            <div className="recommendation-card">
                                <AlertCircle size={20} />
                                <h4>Pay Bills on Time</h4>
                                <p>Ensure all your loan EMIs and credit card bills are paid before due dates.</p>
                            </div>
                            <div className="recommendation-card">
                                <Calendar size={20} />
                                <h4>Credit History Length</h4>
                                <p>Maintain long-term credit accounts to build a strong credit history.</p>
                            </div>
                            {/* Add more recommendations based on score */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanEligibility; 