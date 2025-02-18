import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HomeLoan from './pages/HomeLoan';
import CarLoan from './pages/CarLoan';
import GoldLoan from './pages/GoldLoan';
import LearnMore from './pages/LearnMore';
import LoanEligibility from './pages/LoanEligibility';
import CompareGuest from './pages/CompareGuest';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(Boolean(localStorage.getItem('token')));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route 
                        path="/compare" 
                        element={
                            isAuthenticated ? 
                                <Compare /> : 
                                <CompareGuest />
                        } 
                    />
                    <Route 
                        path="/dashboard" 
                        element={
                            isAuthenticated ? 
                                <Dashboard /> : 
                                <Navigate to="/" />
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            isAuthenticated ? 
                                <Profile /> : 
                                <Navigate to="/" />
                        } 
                    />
                    <Route path="/loans/home" element={<HomeLoan />} />
                    <Route path="/loans/car" element={<CarLoan />} />
                    <Route path="/loans/gold" element={<GoldLoan />} />
                    <Route path="/about" element={<LearnMore />} />
                    <Route path="/loan-eligibility" element={<LoanEligibility />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;