export const calculateCreditScore = (formData) => {
    let baseScore = 600;  // Starting base score
    
    // Income factor (0-100 points)
    const annualIncome = parseFloat(formData.annualIncome.replace(/,/g, ''));
    if (annualIncome >= 1500000) baseScore += 100;  // > 15L
    else if (annualIncome >= 1000000) baseScore += 80;  // > 10L
    else if (annualIncome >= 500000) baseScore += 60;  // > 5L
    else if (annualIncome >= 300000) baseScore += 40;  // > 3L
    
    // Employment stability (0-50 points)
    const yearsInJob = parseInt(formData.yearsInCurrentJob);
    if (yearsInJob >= 5) baseScore += 50;
    else if (yearsInJob >= 3) baseScore += 35;
    else if (yearsInJob >= 1) baseScore += 20;
    
    // Employment type (0-50 points)
    if (formData.employmentType === 'Salaried') baseScore += 50;
    else if (formData.employmentType === 'Self-Employed') baseScore += 40;
    
    // Loan rejection history (-100 points if yes)
    if (formData.loanRejectionHistory === 'Yes') baseScore -= 100;
    
    // Previous loan history analysis
    if (formData.hasPreviousLoans === 'Yes' && formData.previousLoans.length > 0) {
        let totalLoanAmount = 0;
        formData.previousLoans.forEach(loan => {
            const loanAmount = parseFloat(loan.loanAmount.replace(/,/g, ''));
            totalLoanAmount += loanAmount;
        });
        
        // If total previous loans are more than 5 times annual income, reduce score
        if (totalLoanAmount > annualIncome * 5) baseScore -= 50;
        else if (totalLoanAmount > annualIncome * 3) baseScore -= 30;
    }
    
    // Credit card usage factor
    const monthlyCardUsage = parseFloat(formData.avgCreditCardUsage.replace(/,/g, ''));
    const monthlyIncome = annualIncome / 12;
    const cardUsageRatio = monthlyCardUsage / monthlyIncome;
    
    if (cardUsageRatio <= 0.1) baseScore += 100;  // Using less than 10% of monthly income
    else if (cardUsageRatio <= 0.3) baseScore += 70;  // Using less than 30% of monthly income
    else if (cardUsageRatio <= 0.5) baseScore += 40;  // Using less than 50% of monthly income
    else baseScore -= 50;  // Using more than 50% of monthly income
    
    // Ensure score stays within valid range (300-900)
    return Math.max(300, Math.min(900, baseScore));
};

export const getLoanEligibility = (creditScore, loanType) => {
    const baseEligibility = {
        isEligible: false,
        maxEligibleAmount: 0,
        interestRate: 0,
        message: ''
    };

    if (!creditScore) {
        return baseEligibility;
    }

    switch (loanType) {
        case 'home':
            if (creditScore >= 750) {
                return {
                    isEligible: true,
                    maxEligibleAmount: 10000000, // 1 Cr
                    interestRate: 8.5,
                    message: 'Excellent credit score! You qualify for our best rates.'
                };
            } else if (creditScore >= 650) {
                return {
                    isEligible: true,
                    maxEligibleAmount: 7500000, // 75L
                    interestRate: 9.5,
                    message: 'Good credit score. Competitive rates available.'
                };
            } else {
                return {
                    isEligible: false,
                    maxEligibleAmount: 0,
                    interestRate: 0,
                    message: 'Improve your credit score to qualify for a home loan.'
                };
            }

        case 'car':
            if (creditScore >= 700) {
                return {
                    isEligible: true,
                    maxEligibleAmount: 1500000, // 15L
                    interestRate: 7.5,
                    message: 'You qualify for premium car loan rates!'
                };
            } else if (creditScore >= 600) {
                return {
                    isEligible: true,
                    maxEligibleAmount: 800000, // 8L
                    interestRate: 8.5,
                    message: 'Standard car loan rates available.'
                };
            } else {
                return {
                    isEligible: false,
                    maxEligibleAmount: 0,
                    interestRate: 0,
                    message: 'Work on improving your credit score for better car loan options.'
                };
            }

        case 'gold':
            // Gold loans typically have lower credit requirements
            if (creditScore >= 600) {
                return {
                    isEligible: true,
                    maxEligibleAmount: 500000, // 5L
                    interestRate: 7.0,
                    message: 'Eligible for gold loan with competitive rates.'
                };
            } else {
                return {
                    isEligible: true,
                    maxEligibleAmount: 300000, // 3L
                    interestRate: 8.0,
                    message: 'Basic gold loan available with standard rates.'
                };
            }

        default:
            return baseEligibility;
    }
}; 