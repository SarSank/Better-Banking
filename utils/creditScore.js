export function calculateCreditScore(userData) {
    let score = 300; // Base score (Minimum)

    // 1. Income & Loan Utilization (40%)
    const totalLoans = userData.previousLoans.reduce((sum, loan) => sum + Number(loan.loanAmount), 0);
    const utilization = ((totalLoans + Number(userData.avgCreditCardUsage) * 12) / Number(userData.annualIncome)) * 100;
    
    if (utilization <= 30) score += 360;
    else if (utilization <= 50) score += 270;
    else if (utilization <= 70) score += 180;
    else score += 90;

    // 2. Loan & Credit History (30%)
    // Using the first loan's payment history as reference
    const onTimePayments = userData.hasPreviousLoans === 'Yes' ? 'Always' : 'Sometimes';
    if (onTimePayments === "Always") score += 225;
    else if (onTimePayments === "Sometimes") score += 150;
    else score += 75;

    // Get oldest loan age from previous loans
    const oldestLoanAge = Math.max(...userData.previousLoans.map(loan => Number(loan.loanAge)), 0);
    if (oldestLoanAge >= 5) score += 45;
    else if (oldestLoanAge >= 2) score += 30;
    else score += 15;

    // 3. Recent Loan Inquiries (10%)
    const recentInquiries = userData.previousLoans.length;
    if (recentInquiries === 0) score += 90;
    else if (recentInquiries <= 2) score += 60;
    else score += 30;

    // 4. Employment Stability (10%)
    if (userData.employmentType === "Salaried") score += 45;
    else if (userData.employmentType === "Self-Employed") score += 30;
    else score += 15;

    const yearsInJob = Number(userData.yearsInCurrentJob);
    if (yearsInJob >= 3) score += 45;
    else if (yearsInJob >= 1) score += 30;
    else score += 15;

    // 5. Age & Demographics (10%)
    const age = Number(userData.age);
    if (age >= 25 && age <= 45) score += 90;
    else if (age < 25) score += 60;
    else score += 75;

    return Math.min(900, Math.round(score));
}

export function getLoanEligibility(creditScore, loanType) {
    const baseRates = {
        home: {
            baseRate: 8.50,
            maxAmount: 10000000
        },
        car: {
            baseRate: 7.25,
            maxAmount: 1500000
        },
        gold: {
            baseRate: 7.00,
            maxAmount: 500000
        }
    };

    let rateAdjustment = 0;
    let eligibilityPercentage = 0;

    if (creditScore >= 750) {
        rateAdjustment = 0;
        eligibilityPercentage = 90;
    } else if (creditScore >= 650) {
        rateAdjustment = 0.5;
        eligibilityPercentage = 75;
    } else if (creditScore >= 550) {
        rateAdjustment = 1.5;
        eligibilityPercentage = 60;
    } else {
        rateAdjustment = 2.5;
        eligibilityPercentage = 40;
    }

    const loanInfo = baseRates[loanType];
    return {
        interestRate: (loanInfo.baseRate + rateAdjustment).toFixed(2),
        maxEligibleAmount: Math.round(loanInfo.maxAmount * (eligibilityPercentage / 100)),
        creditScore
    };
} 