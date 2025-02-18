import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, GraduationCap, Home as HomeIcon, ChevronRight, Shield, Users, Calculator, Clock, Award, CheckCircle } from 'lucide-react';
import './Home.css';
import processImage from '../assets/images/loan-process.jpg';
import toolsImage from '../assets/images/financial-tools.jpg';
import heroImage from '../assets/images/hero1.jpg';

const loanTypes = [
  {
    icon: Building2,
    title: 'Personal Loans',
    description: 'Find the best personal loan rates for your needs',
    benefits: ['Quick approval process', 'Competitive interest rates', 'Flexible repayment terms'],
    link: '/compare?type=personal'
  },
  {
    icon: Briefcase,
    title: 'Business Loans',
    description: 'Grow your business with competitive financing options',
    benefits: ['Working capital solutions', 'Equipment financing', 'Business expansion'],
    link: '/compare?type=business'
  },
  {
    icon: GraduationCap,
    title: 'Student Loans',
    description: 'Fund your education with flexible student loans',
    benefits: ['Income-based repayment', 'Grace period options', 'No prepayment penalties'],
    link: '/compare?type=student'
  },
  {
    icon: HomeIcon,
    title: 'Mortgage Loans',
    description: 'Make your dream home a reality with the right mortgage',
    benefits: ['Fixed & variable rates', 'First-time buyer programs', 'Refinancing options'],
    link: '/compare?type=mortgage'
  }
];

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background" style={{ backgroundImage: `url(${heroImage})` }}></div>
        <div className="container">
          <div className="hero-content">
            <h1>Your Path to Financial Freedom Starts Here</h1>
            <p>Compare and find the best loan options tailored to your needs</p>
            <div className="hero-buttons">
              <Link to="/compare" className="btn-compare">
                <div id="container-stars">
                  <div id="stars"></div>
                </div>
                <div id="glow">
                  <div className="circle-container">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-container">
                    <div className="circle"></div>
                  </div>
                </div>
                <strong>COMPARE LOANS</strong>
              </Link>
              <Link to="/about" className="glow-button">LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="loan-types-section">
        <div className="container">
          <h2>Explore Loan Options</h2>
          <div className="loan-grid">
            {loanTypes.map((type) => (
              <Link key={type.title} to={type.link} className="loan-card">
                <div className="icon-container">
                  <type.icon />
                </div>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
                <ul className="benefits-list">
                  {type.benefits.map((benefit, index) => (
                    <li key={index}>
                      <CheckCircle className="check-icon" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools for Financial Journey Section */}
      <section className="financial-tools-section">
        <div className="container">
          <h2>Tools for Financial Journey</h2>
          <p className="section-description">Empower your financial decisions with our comprehensive suite of tools</p>
          
          <div className="financial-tools-content">
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-icon">
                  <HomeIcon />
                </div>
                <h3>Mortgage Rates</h3>
                <p>Compare current mortgage rates and estimate your monthly payments</p>
                <Link to="/tools/mortgage-rates" className="tool-link">
                  Calculate Rates <ChevronRight className="icon" />
                </Link>
              </div>

              <div className="tool-card">
                <div className="tool-icon">
                  <Award />
                </div>
                <h3>Ratings & Reviews</h3>
                <p>Read authentic reviews and ratings from verified borrowers</p>
                <Link to="/tools/reviews" className="tool-link">
                  View Reviews <ChevronRight className="icon" />
                </Link>
              </div>

              <div className="tool-card">
                <div className="tool-icon">
                  <Calculator />
                </div>
                <h3>Payment Calculator</h3>
                <p>Plan your budget with our easy-to-use loan payment calculator</p>
                <Link to="/tools/calculator" className="tool-link">
                  Calculate Now <ChevronRight className="icon" />
                </Link>
              </div>

              <div className="tool-card">
                <div className="tool-icon">
                  <Shield />
                </div>
                <h3>Credit Score</h3>
                <p>Check and monitor your credit score without affecting it</p>
                <Link to="/tools/credit-score" className="tool-link">
                  Check Score <ChevronRight className="icon" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="how-it-works-content">
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-icon">
                  <Calculator />
                </div>
                <h3>1. Compare Rates</h3>
                <p>Get personalized loan offers from multiple lenders in minutes</p>
              </div>
              <div className="step-item">
                <div className="step-icon">
                  <Users />
                </div>
                <h3>2. Choose Lender</h3>
                <p>Select the best offer that matches your needs</p>
              </div>
              <div className="step-item">
                <div className="step-icon">
                  <ChevronRight />
                </div>
                <h3>3. Sort and Select</h3>
                <p>Filter and sort options based on your preferences and requirements</p>
              </div>
            </div>
            <div className="process-image">
              <img 
                src={processImage} 
                alt="Loan Process Illustration"
                className="process-illustration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <Shield className="benefit-icon" />
              <div>
                <h3>Secure & Trusted</h3>
                <p>Your data is protected with bank-level security and encryption</p>
              </div>
            </div>
            <div className="benefit-card">
              <Clock className="benefit-icon" />
              <div>
                <h3>Fast Process</h3>
                <p>Get loan offers within minutes, not days</p>
              </div>
            </div>
            <div className="benefit-card">
              <Calculator className="benefit-icon" />
              <div>
                <h3>Best Rates</h3>
                <p>Compare and find the most competitive rates available</p>
              </div>
            </div>
            <div className="benefit-card">
              <Award className="benefit-icon" />
              <div>
                <h3>Expert Support</h3>
                <p>Get guidance from loan experts throughout your journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Perfect Loan?</h2>
          <p>
            Join thousands of satisfied customers who have found their ideal loan options through our platform
          </p>
          <Link to="/compare" className="cta-button">
            Get Started Now
            <ChevronRight className="arrow-icon" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {[
              { q: "How does the loan comparison work?", a: "We partner with multiple lenders to provide you with personalized loan offers based on your needs and qualifications." },
              { q: "Is it free to use your service?", a: "Yes, our loan comparison service is completely free to use. We make money when you successfully get a loan through our platform." },
              { q: "Will comparing loans affect my credit score?", a: "No, our initial comparison process uses a soft credit check which doesn't impact your credit score." }
            ].map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;