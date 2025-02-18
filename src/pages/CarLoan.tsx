import React, { useState, useEffect } from 'react';
import BankSelector from '../components/BankSelector';
import CarLoanCalculator from '../components/CarLoanCalculator';
import './CarLoan.css';
import { useLocation, useNavigate } from 'react-router-dom';

const ICICI_RATES = {
    baseRate: 9.10
};

const BANKS = [
    { id: 'icici', name: 'ICICI Bank', rates: ICICI_RATES },
    { id: 'hdfc', name: 'HDFC Bank', rates: null },
    { id: 'sbi', name: 'State Bank of India', rates: null },
    { id: 'kotak', name: 'Kotak Bank', rates: null },
];

const CarLoan: React.FC = () => {
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState(BANKS[0]);
    const [loanData, setLoanData] = useState<{
        creditScore: number;
        employmentType: string;
        annualIncome: string;
    } | null>(null);

    useEffect(() => {
        // Try to get data from localStorage
        const savedData = localStorage.getItem('loanApplicationData');
        const comparisonData = localStorage.getItem('comparisonData');
        
        try {
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData && parsedData.creditScore) {
                    setLoanData(parsedData);
                }
            } else if (comparisonData) {
                const { creditScore, formData } = JSON.parse(comparisonData);
                if (creditScore && formData) {
                    const data = {
                        creditScore,
                        employmentType: formData.employmentType,
                        annualIncome: formData.annualIncome
                    };
                    setLoanData(data);
                }
            } else {
                navigate('/compare');
            }
        } catch (error) {
            console.error('Error parsing loan data:', error);
            navigate('/compare');
        }
    }, [navigate]);

    if (!loanData) {
        return <div className="loading">Loading loan data...</div>;
    }

    return (
        <div className="loan-page-container">
            <div className="loan-page-header">
                <h1>Car Loan Interest Rates</h1>
                <p>Find the best car loan rates tailored to your profile</p>
            </div>
            
            <div className="loan-eligibility-summary">
                <h2>Your Loan Eligibility Details</h2>
                <div className="eligibility-details">
                    <div className="detail-item">
                        <label>Credit Score:</label>
                        <span>{loanData?.creditScore}</span>
                    </div>
                    {/* ... other details ... */}
                </div>
            </div>

            <BankSelector 
                banks={BANKS} 
                selectedBank={selectedBank} 
                onBankSelect={setSelectedBank}
            />

            {selectedBank.rates && loanData && (
                <CarLoanCalculator 
                    bankRates={selectedBank.rates}
                    loanData={loanData}
                />
            )}
        </div>
    );
};

export default CarLoan; 