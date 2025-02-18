import React, { useState, useEffect } from 'react';
import './GoldLoanCalculator.css';

interface GoldLoanCalculatorProps {
    bankRates: any;
    loanData: {
        creditScore: number;
        employmentType: string;
        annualIncome: string;
    };
}

const GoldLoanCalculator: React.FC<GoldLoanCalculatorProps> = ({ bankRates, loanData }) => {
    const [karat, setKarat] = useState('24');
    const [tenure, setTenure] = useState('6');
    const [ornaments, setOrnaments] = useState('1');
    const [loanAmount, setLoanAmount] = useState<number | null>(null);

    useEffect(() => {
        const baseAmount = bankRates.rates[Number(tenure)][Number(karat)];
        setLoanAmount(baseAmount * Number(ornaments));
    }, [karat, tenure, ornaments, bankRates]);

    return (
        <div className="loan-calculator">
            <h2>Gold Loan Value Calculator</h2>
            <div className="calculator-form">
                <div className="form-group">
                    <label>Gold Purity (Karat)</label>
                    <select 
                        value={karat}
                        onChange={(e) => setKarat(e.target.value)}
                        className="select-input"
                    >
                        {[24, 22, 21, 20, 19, 18].map(k => (
                            <option key={k} value={k}>
                                {k}K
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Loan Tenure</label>
                    <select 
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        className="select-input"
                    >
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Number of Ornaments</label>
                    <input
                        type="number"
                        value={ornaments}
                        onChange={(e) => setOrnaments(e.target.value)}
                        min="1"
                        className="number-input"
                    />
                </div>

                {loanAmount && (
                    <div className="loan-value-result">
                        <h3>Maximum Loan Value</h3>
                        <div className="amount">₹ {loanAmount.toLocaleString('en-IN')}</div>
                        <div className="per-ornament">
                            (₹ {(loanAmount / Number(ornaments)).toLocaleString('en-IN')} per ornament)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoldLoanCalculator; 