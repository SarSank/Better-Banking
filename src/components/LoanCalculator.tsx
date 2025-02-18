import React, { useState, useEffect } from 'react';
import './LoanCalculator.css';

interface LoanCalculatorProps {
    bankRates: any;
    employmentType: 'salaried' | 'selfEmployed';
    loanData: {
        creditScore: number;
        employmentType: string;
        annualIncome: string;
    };
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ bankRates, employmentType, loanData }) => {
    const [loanAmount, setLoanAmount] = useState('');
    const [tenure, setTenure] = useState('20');
    const [cibilScore, setCibilScore] = useState('');
    const [error, setError] = useState('');
    const [emi, setEmi] = useState<number | null>(null);
    const [totalPayment, setTotalPayment] = useState<number | null>(null);
    const [interestRate, setInterestRate] = useState('');

    useEffect(() => {
        if (!loanData) return;

        // Set interest rate based on credit score and employment type
        const rate = calculateInterestRate(loanData.creditScore, employmentType, bankRates);
        if (rate) {
            setInterestRate(rate.toString());
            setCibilScore(loanData.creditScore.toString());
        }

        // Set max loan amount based on annual income
        if (loanData.annualIncome) {
            const maxLoanAmount = calculateMaxLoanAmount(loanData.annualIncome);
            setLoanAmount(maxLoanAmount.toString());
        }
    }, [loanData, employmentType, bankRates]);

    const calculateInterestRate = (creditScore: number, empType: string, rates: any) => {
        if (!rates || !rates.cibilRates) return null;
        
        if (creditScore >= 800) {
            return empType === 'salaried' ? 9.00 : 9.00;
        } else if (creditScore >= 750) {
            return empType === 'salaried' ? 9.00 : 9.10;
        } else if (creditScore >= 700) {
            return empType === 'salaried' ? 9.25 : 9.40;
        } else {
            return empType === 'salaried' ? 9.50 : 9.65;
        }
    };

    const calculateMaxLoanAmount = (annualIncome: string) => {
        // Convert annual income to number
        const income = parseFloat(annualIncome.replace(/,/g, ''));
        // Typically, banks allow up to 60 times monthly income
        return Math.min(income * 5, 10000000); // Cap at 1 Cr
    };

    const calculateLoan = () => {
        // Reset previous results and errors
        setError('');
        setEmi(null);
        setTotalPayment(null);

        // Validate inputs
        if (!loanAmount) {
            setError('Please enter loan amount');
            return;
        }
        if (!cibilScore) {
            setError('Please enter CIBIL score');
            return;
        }

        const score = Number(cibilScore);
        const amount = Number(loanAmount);

        if (score < 300) {
            setError('CIBIL score cannot be less than 300');
            return;
        }
        if (score > 900) {
            setError('CIBIL score cannot exceed 900');
            return;
        }

        // Calculate EMI
        const monthlyRate = Number(interestRate) / (12 * 100);
        const months = Number(tenure) * 12;
        const emiAmount = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                        (Math.pow(1 + monthlyRate, months) - 1);
        
        setEmi(emiAmount);
        setTotalPayment(emiAmount * months);
    };

    return (
        <div className="loan-calculator">
            <h2>EMI Calculator</h2>
            <div className="calculator-form">
                <div className="form-group">
                    <label>Loan Amount (₹)</label>
                    <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="Enter loan amount"
                    />
                </div>
                
                <div className="form-group">
                    <label>CIBIL Score</label>
                    <input
                        type="number"
                        value={cibilScore}
                        onChange={(e) => setCibilScore(e.target.value)}
                        placeholder="Enter CIBIL score (300-900)"
                    />
                </div>

                <div className="form-group">
                    <label>Tenure (Years)</label>
                    <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
                        {[5,10,15,20].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button onClick={calculateLoan} className="calculate-button">
                    Calculate EMI
                </button>

                {interestRate && (
                    <div className="interest-rate">
                        Applicable Interest Rate: {interestRate}%
                    </div>
                )}

                {emi && totalPayment && (
                    <div className="calculation-results">
                        <div className="result-item">
                            <label>Monthly EMI</label>
                            <div className="amount">₹ {emi.toFixed(2)}</div>
                        </div>
                        <div className="result-item">
                            <label>Total Payment</label>
                            <div className="amount">₹ {totalPayment.toFixed(2)}</div>
                        </div>
                        <div className="result-item">
                            <label>Total Interest</label>
                            <div className="amount">₹ {(totalPayment - Number(loanAmount)).toFixed(2)}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanCalculator; 