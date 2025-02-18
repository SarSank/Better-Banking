import React, { useState, useEffect } from 'react';
import BankSelector from '../components/BankSelector';
import GoldLoanCalculator from '../components/GoldLoanCalculator';
import './GoldLoan.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

const ICICI_RATES = {
    rates: {
        6: {  // 6 months tenure
            24: 115460,
            22: 105840,
            21: 101020,
            20: 96220,
            19: 96220,
            18: 87780,
        },
        12: { // 12 months tenure
            24: 117040,
            22: 107280,
            21: 102400,
            20: 97520,
            19: 92660,
            18: 86600,
        }
    }
};

const BANKS = [
    { id: 'icici', name: 'ICICI Bank', rates: ICICI_RATES },
    { id: 'hdfc', name: 'HDFC Bank', rates: null },
    { id: 'sbi', name: 'State Bank of India', rates: null },
    { id: 'kotak', name: 'Kotak Bank', rates: null },
];

const GoldLoan: React.FC = () => {
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
                <h1>Gold Loan Calculator</h1>
                <p>Calculate your gold loan value based on purity and weight</p>
            </div>
            
            <div className="loan-eligibility-summary">
                <h2>
                    <Award size={24} />
                    Your Loan Eligibility Details
                </h2>
                <div className="eligibility-details">
                    <div className="detail-item">
                        <label>Credit Score:</label>
                        <span>{loanData.creditScore}</span>
                    </div>
                    <div className="detail-item">
                        <label>Employment Type:</label>
                        <span>{loanData.employmentType}</span>
                    </div>
                    <div className="detail-item">
                        <label>Annual Income:</label>
                        <span>₹{loanData.annualIncome}</span>
                    </div>
                </div>
            </div>

            <BankSelector 
                banks={BANKS} 
                selectedBank={selectedBank} 
                onBankSelect={setSelectedBank}
            />

            {selectedBank.rates && loanData && (
                <GoldLoanCalculator 
                    bankRates={selectedBank.rates}
                    loanData={loanData}
                />
            )}
        </div>
    );
};

export default GoldLoan; 