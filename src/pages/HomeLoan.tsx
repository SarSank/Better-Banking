import React, { useState, useEffect } from 'react';
import BankSelector from '../components/BankSelector';
import LoanRatesTable from '../components/LoanRatesTable';
import LoanCalculator from '../components/LoanCalculator';
import './HomeLoan.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, AlertCircle } from 'lucide-react';
import '../styles/LoanPages.css';

export interface LoanRate {
    cibil?: string;
    salaried: string;
    selfEmployed: string;
}

export interface LoanSlab {
    slab: string;
    salaried: string;
    selfEmployed: string;
}

const ICICI_RATES = {
    cibilRates: [
        { cibil: ">800", salaried: "9.00", selfEmployed: "9.00" },
        { cibil: "750-800", salaried: "9.00", selfEmployed: "9.10" },
    ],
    slabRates: [
        { slab: "Up to ₹ 35 lakhs", salaried: "9.25 - 9.65", selfEmployed: "9.40 - 9.80" },
        { slab: "₹ 35 lakhs to ₹ 75 lakhs", salaried: "9.50 - 9.80", selfEmployed: "9.65 - 9.95" },
        { slab: "Above ₹ 75 lakhs", salaried: "9.60 - 9.90", selfEmployed: "9.75 - 10.05" },
    ]
};

const BANKS = [
    { id: 'icici', name: 'ICICI Bank', rates: ICICI_RATES },
    { id: 'hdfc', name: 'HDFC Bank', rates: null }, // To be added later
    { id: 'sbi', name: 'State Bank of India', rates: null }, // To be added later
    { id: 'kotak', name: 'Kotak Bank', rates: null }, // To be added later
];

const HomeLoan: React.FC = () => {
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState(BANKS[0]);
    const [employmentType, setEmploymentType] = useState<'salaried' | 'selfEmployed'>('salaried');
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
                    setEmploymentType(parsedData.employmentType.toLowerCase() === 'salaried' ? 'salaried' : 'selfEmployed');
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
                    setEmploymentType(data.employmentType.toLowerCase() === 'salaried' ? 'salaried' : 'selfEmployed');
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
                <h1>Home Loan Interest Rates</h1>
                <p>Find the best home loan rates tailored to your profile</p>
            </div>
            
            <div className="loan-eligibility-summary">
                <h2>
                    <Award size={24} />
                    Your Loan Eligibility Details
                </h2>
                <div className="eligibility-details">
                    <div className="detail-item">
                        <label>CIBIL Score:</label>
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

            {selectedBank.rates && (
                <>
                    <div className="employment-selector">
                        <label>
                            <input
                                type="radio"
                                value="salaried"
                                checked={employmentType === 'salaried'}
                                onChange={(e) => setEmploymentType(e.target.value as 'salaried')}
                            /> Salaried
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="selfEmployed"
                                checked={employmentType === 'selfEmployed'}
                                onChange={(e) => setEmploymentType(e.target.value as 'selfEmployed')}
                            /> Self Employed
                        </label>
                    </div>

                    <div className="rates-section">
                        <div className="rates-column">
                            <h2>CIBIL Score Based Rates</h2>
                            <LoanRatesTable 
                                rates={selectedBank.rates.cibilRates} 
                                employmentType={employmentType}
                                type="cibil"
                            />
                        </div>
                        
                        <div className="rates-column">
                            <h2>Loan Amount Based Rates</h2>
                            <LoanRatesTable 
                                rates={selectedBank.rates.slabRates} 
                                employmentType={employmentType}
                                type="slab"
                            />
                        </div>
                    </div>

                    <LoanCalculator 
                        bankRates={selectedBank.rates}
                        employmentType={employmentType}
                        loanData={loanData}
                    />

                    <div className="loan-notes">
                        <h3>
                            <AlertCircle size={20} />
                            Important Notes
                        </h3>
                        <ul>
                            <li>CIBIL Score based rates are applicable for all loan amounts</li>
                            <li>For CIBIL Score below 750, slab-based rates will apply</li>
                            <li>Processing fee: 0.5% of loan amount</li>
                            <li>Maximum tenure: 20 years</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeLoan; 