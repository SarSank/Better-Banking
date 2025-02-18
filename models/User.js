import mongoose from 'mongoose';

const ComparisonSchema = new mongoose.Schema({
    formData: {
        fullName: String,
        age: String,
        cityRegion: String,
        annualIncome: String,
        employmentType: String,
        yearsInCurrentJob: String,
        desiredLoanAmount: String,
        hasPreviousLoans: String,
        previousLoans: [{
            loanAmount: String,
            emiAmount: String,
            loanAge: String,
            interestRate: String
        }],
        loanRejectionHistory: String,
        avgCreditCardUsage: String
    },
    creditScore: Number,
    eligibility: {
        home: Object,
        car: Object,
        gold: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        fullName: String,
        phone: String,
        address: String,
        dateOfBirth: String,
        age: String,
        panCard: String,
        aadharNumber: String,
        occupation: String
    },
    bankingDetails: {
        accountNumber: String,
        bankName: String,
        ifscCode: String
    },
    loanHistory: [{
        date: String,
        type: String,
        amount: Number,
        status: String
    }],
    comparisons: [ComparisonSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', UserSchema); 