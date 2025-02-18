// This is for users who haven't signed up
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Lock, Shield, Plus, Trash } from 'lucide-react';
import './Compare.css';
import { calculateCreditScore, getLoanEligibility } from '../utils/creditScore';
import { formatNumberWithCommas, parseFormattedNumber } from '../utils/formatNumber';
import AuthModal from '../components/AuthModal';

interface LoanHistory {
    loanAmount: string;
    emiAmount: string;
    loanAge: string;
    interestRate: string;
}

interface CompareFormData {
    // Basic Information (required for guest users)
    fullName: string;
    age: string;
    cityRegion: string;
    
    // Financial & Employment Details
    annualIncome: string;
    employmentType: 'Salaried' | 'Self-Employed' | 'Unemployed' | '';
    yearsInCurrentJob: string;
    desiredLoanAmount: string;
    
    // Previous Loans
    hasPreviousLoans: 'Yes' | 'No' | '';
    previousLoans: LoanHistory[];
    
    // Credit History
    loanRejectionHistory: 'Yes' | 'No' | '';
    avgCreditCardUsage: string;
}

const CompareGuest: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<CompareFormData>({
        fullName: '',
        age: '',
        cityRegion: '',
        annualIncome: '',
        employmentType: '',
        yearsInCurrentJob: '',
        desiredLoanAmount: '',
        hasPreviousLoans: '',
        previousLoans: [],
        loanRejectionHistory: '',
        avgCreditCardUsage: ''
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'hasPreviousLoans' && value === 'Yes' && formData.previousLoans.length === 0) {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                previousLoans: [{
                    loanAmount: '',
                    emiAmount: '',
                    loanAge: '',
                    interestRate: ''
                }]
            }));
        } else if (name === 'hasPreviousLoans' && value === 'No') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                previousLoans: []
            }));
        } else if (isAmountField(name)) {
            const formattedValue = value ? formatNumberWithCommas(value) : '';
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const isAmountField = (fieldName: string): boolean => {
        return [
            'annualIncome',
            'desiredLoanAmount',
            'avgCreditCardUsage',
            'loanAmount',
            'emiAmount'
        ].includes(fieldName);
    };

    const handleLoanHistoryChange = (index: number, field: keyof LoanHistory, value: string) => {
        setFormData(prev => ({
            ...prev,
            previousLoans: prev.previousLoans.map((loan, i) => 
                i === index ? { 
                    ...loan, 
                    [field]: isAmountField(field) ? 
                        (value ? formatNumberWithCommas(value) : '') : 
                        value 
                } : loan
            )
        }));
    };

    const addNewLoan = () => {
        setFormData(prev => ({
            ...prev,
            previousLoans: [
                ...prev.previousLoans,
                { loanAmount: '', emiAmount: '', loanAge: '', interestRate: '' }
            ]
        }));
    };

    const removeLoan = (index: number) => {
        setFormData(prev => ({
            ...prev,
            previousLoans: prev.previousLoans.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Store form data in localStorage before redirecting
        localStorage.setItem('tempCompareData', JSON.stringify(formData));

        // Ask user if they want to sign up
        const wantsToSignUp = window.confirm(
            'Would you like to create an account to save your comparison and get personalized recommendations?'
        );

        if (wantsToSignUp) {
            setIsAuthModalOpen(true);
            return;
        }

        // If user doesn't want to sign up, proceed with comparison
        try {
            const parsedFormData = {
                ...formData,
                annualIncome: parseFormattedNumber(formData.annualIncome),
                desiredLoanAmount: parseFormattedNumber(formData.desiredLoanAmount),
                avgCreditCardUsage: parseFormattedNumber(formData.avgCreditCardUsage),
                previousLoans: formData.previousLoans.map(loan => ({
                    ...loan,
                    loanAmount: parseFormattedNumber(loan.loanAmount),
                    emiAmount: parseFormattedNumber(loan.emiAmount)
                }))
            };

            const creditScore = calculateCreditScore(parsedFormData);
            const eligibility = {
                home: getLoanEligibility(creditScore, 'home'),
                car: getLoanEligibility(creditScore, 'car'),
                gold: getLoanEligibility(creditScore, 'gold')
            };

            navigate('/loan-eligibility', { 
                state: { 
                    creditScore,
                    eligibility,
                    userData: parsedFormData
                } 
            });
        } catch (error) {
            console.error('Error processing comparison:', error);
        }
    };

    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 1:
                return Boolean(
                    formData.fullName &&
                    formData.age &&
                    formData.cityRegion
                );
            case 2:
                return Boolean(
                    formData.annualIncome &&
                    formData.employmentType &&
                    formData.yearsInCurrentJob &&
                    formData.desiredLoanAmount
                );
            case 3:
                // If hasPreviousLoans is 'No', allow proceeding
                if (formData.hasPreviousLoans === 'No') {
                    return true;
                }
                // If hasPreviousLoans is 'Yes', check if loans are filled out
                if (formData.hasPreviousLoans === 'Yes') {
                    return formData.previousLoans.every(loan => 
                        loan.loanAmount && 
                        loan.emiAmount && 
                        loan.loanAge
                    );
                }
                // If nothing is selected, return false
                return false;
            case 4:
                return Boolean(
                    formData.loanRejectionHistory &&
                    formData.avgCreditCardUsage
                );
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-step">
                        <h2>Basic Information</h2>
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
                        <div className="form-group">
                            <label>City/Region</label>
                            <input
                                type="text"
                                name="cityRegion"
                                value={formData.cityRegion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="form-step">
                        <h2>Financial & Employment Details</h2>
                        <div className="form-group">
                            <label>Annual Income</label>
                            <div className="input-with-prefix">
                                <span className="prefix">₹</span>
                                <input
                                    type="text"
                                    name="annualIncome"
                                    value={formData.annualIncome}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Employment Type</label>
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="Salaried">Salaried</option>
                                <option value="Self-Employed">Self-Employed</option>
                                <option value="Unemployed">Unemployed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Years in Current Job/Business</label>
                            <input
                                type="text"
                                name="yearsInCurrentJob"
                                value={formData.yearsInCurrentJob}
                                onChange={handleChange}
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Desired Loan Amount</label>
                            <div className="input-with-prefix">
                                <span className="prefix">₹</span>
                                <input
                                    type="text"
                                    name="desiredLoanAmount"
                                    value={formData.desiredLoanAmount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="form-step">
                        <h2>Previous Loan History</h2>
                        <div className="form-group">
                            <label>Do you have any existing loans?</label>
                            <select
                                name="hasPreviousLoans"
                                value={formData.hasPreviousLoans}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        {formData.hasPreviousLoans === 'Yes' && (
                            <div className="loan-history-section">
                                {formData.previousLoans.map((loan, index) => (
                                    <div key={index} className="loan-entry">
                                        <h3>Loan {index + 1}</h3>
                                        <div className="loan-details-grid">
                                            <div className="form-group">
                                                <label>Loan Amount</label>
                                                <div className="input-with-prefix">
                                                    <span className="prefix">₹</span>
                                                    <input
                                                        type="text"
                                                        value={loan.loanAmount}
                                                        onChange={(e) => handleLoanHistoryChange(index, 'loanAmount', e.target.value)}
                                                        placeholder="0"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>EMI Amount</label>
                                                <div className="input-with-prefix">
                                                    <span className="prefix">₹</span>
                                                    <input
                                                        type="text"
                                                        value={loan.emiAmount}
                                                        onChange={(e) => handleLoanHistoryChange(index, 'emiAmount', e.target.value)}
                                                        placeholder="0"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Loan Age (Years)</label>
                                                <input
                                                    type="text"
                                                    value={loan.loanAge}
                                                    onChange={(e) => handleLoanHistoryChange(index, 'loanAge', e.target.value)}
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Interest Rate (%)</label>
                                                <input
                                                    type="text"
                                                    value={loan.interestRate}
                                                    onChange={(e) => handleLoanHistoryChange(index, 'interestRate', e.target.value)}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLoan(index)}
                                                className="remove-loan-btn"
                                            >
                                                <Trash size={16} /> Remove Loan
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addNewLoan}
                                    className="add-loan-btn"
                                >
                                    <Plus size={16} /> Add Another Loan
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="form-step">
                        <h2>Credit History</h2>
                        <div className="form-group">
                            <label>Have you faced loan rejection in the past year?</label>
                            <select
                                name="loanRejectionHistory"
                                value={formData.loanRejectionHistory}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Average Credit Card Usage (₹/month)</label>
                            <div className="input-with-prefix">
                                <span className="prefix">₹</span>
                                <input
                                    type="text"
                                    name="avgCreditCardUsage"
                                    value={formData.avgCreditCardUsage}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="compare-page">
            <div className="loan-application-container">
                <div className="form-header">
                    <h1>Loan Comparison Details</h1>
                    <p>Complete your application in just a few steps</p>
                </div>

                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }} 
                    />
                    <div className="steps-indicator">
                        {Array.from({ length: totalSteps }, (_, i) => (
                            <div
                                key={i}
                                className={`step-dot ${i + 1 <= currentStep ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="loan-form">
                    {renderStep()}

                    <div className="form-actions">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="back-button"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}
                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={!validateCurrentStep()}
                                className="next-button"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={!validateCurrentStep()}
                            >
                                Submit Comparison
                            </button>
                        )}
                    </div>

                    <div className="security-info">
                        <div className="security-item">
                            <Lock size={16} />
                            <span>Your information is securely encrypted</span>
                        </div>
                        <div className="security-item">
                            <Shield size={16} />
                            <span>No impact to your credit score</span>
                        </div>
                    </div>
                </form>
            </div>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />
        </div>
    );
};

export default CompareGuest; 