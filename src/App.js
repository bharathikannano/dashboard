import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import components
import ThemeProvider from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import ProfileSummary from './components/ProfileSummary';
import BenefitsSection from './components/BenefitsSection';
import RewardPoints from './components/RewardPoints';
import MonthlyExpenses from './components/MonthlyExpenses';
import TransactionHistory from './components/TransactionHistory';
import CreditUtilization from './components/CreditUtilization';
import InvestmentPortfolio from './components/InvestmentPortfolio';
import SavingsGoals from './components/SavingsGoals';
import { ProfileSkeleton, BenefitCardSkeleton, RewardPointsSkeleton } from './components/Skeleton';

// Mock data
const mockUser = {
  name: 'Rahul Sharma',
  avatar: 'https://i.pravatar.cc/150?img=11',
  level: 5,
  currentXP: 1250,
  targetXP: 2000,
  badges: ['Premium', 'Early Adopter', '1 Year Club']
};

const mockBenefits = [
  {
    icon: '🛍️',
    title: 'CRED Store',
    description: 'Exclusive products at member-only prices with free delivery.',
    cta: 'Shop Now'
  },
  {
    icon: '✈️',
    title: 'Travel Benefits',
    description: 'Special discounts on flights, hotels and holiday packages.',
    cta: 'Explore'
  },
  {
    icon: '🎁',
    title: 'Rewards',
    description: 'Earn CRED coins on every transaction and redeem for exciting rewards.',
    cta: 'View Rewards'
  },
  {
    icon: '💰',
    title: 'Rent Payments',
    description: 'Pay your rent with credit card and earn rewards points.',
    cta: 'Pay Rent'
  },
  {
    icon: '🏦',
    title: 'CRED Cash',
    description: 'Instant personal loans at competitive interest rates.',
    cta: 'Apply Now'
  },
  {
    icon: '🎭',
    title: 'CRED Experiences',
    description: 'Exclusive events, workshops and experiences for members.',
    cta: 'Discover'
  }
];

const mockPointsData = [
  { name: 'Shopping', value: 4500 },
  { name: 'Bill Payments', value: 3200 },
  { name: 'Referrals', value: 1800 },
  { name: 'Promotions', value: 2500 }
];

const mockHistoryData = [
  { month: 'Jan', points: 2400 },
  { month: 'Feb', points: 1398 },
  { month: 'Mar', points: 9800 },
  { month: 'Apr', points: 3908 },
  { month: 'May', points: 4800 },
  { month: 'Jun', points: 3800 }
];

const mockExpensesData = [
  { name: 'Groceries', value: 1200 },
  { name: 'Utilities', value: 800 },
  { name: 'Transport', value: 500 },
  { name: 'Entertainment', value: 700 },
  { name: 'Other', value: 300 },
];

const mockTransactionData = [
  { icon: '🍔', name: 'Zomato', date: '2023-07-10', amount: '-₹550' },
  { icon: '🛒', name: 'Myntra', date: '2023-07-09', amount: '-₹2,500' },
  { icon: '💰', name: 'Salary Credit', date: '2023-07-01', amount: '+₹50,000' },
  { icon: '💡', name: 'Electricity Bill', date: '2023-06-28', amount: '-₹1,200' },
];

const mockCreditUtilization = {
  used: 70000,
  limit: 200000,
};

const mockInvestmentData = [
  { name: 'Jan', value: 100000 },
  { name: 'Feb', value: 105000 },
  { name: 'Mar', value: 115000 },
  { name: 'Apr', value: 110000 },
  { name: 'May', value: 120000 },
  { name: 'Jun', value: 130000 },
];

const mockSavingsData = [
  { name: 'Vacation', saved: 25000, goal: 50000 },
  { name: 'New Car', saved: 80000, goal: 200000 },
  { name: 'Gadgets', saved: 15000, goal: 25000 },
  { name: 'Emergency', saved: 100000, goal: 100000 },
];

function App() {
  // Loading states
  const [loading, setLoading] = useState({
    user: true,
    benefits: true,
    points: true
  });

  // Data states
  const [userData, setUserData] = useState(null);
  const [benefitsData, setBenefitsData] = useState(null);
  const [pointsData, setPointsData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [expensesData, setExpensesData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [creditUtilization, setCreditUtilization] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    // User data
    const userTimer = setTimeout(() => {
      setUserData(mockUser);
      setLoading(prev => ({ ...prev, user: false }));
    }, 1500);

    // Benefits data
    const benefitsTimer = setTimeout(() => {
      setBenefitsData(mockBenefits);
      setLoading(prev => ({ ...prev, benefits: false }));
    }, 2000);

    // Points data
    const pointsTimer = setTimeout(() => {
      setPointsData(mockPointsData);
      setHistoryData(mockHistoryData);
      setExpensesData(mockExpensesData);
      setTransactionData(mockTransactionData);
      setCreditUtilization(mockCreditUtilization);
      setInvestmentData(mockInvestmentData);
      setSavingsData(mockSavingsData);
      setLoading(prev => ({ ...prev, points: false }));
    }, 2500);

    // Cleanup
    return () => {
      clearTimeout(userTimer);
      clearTimeout(benefitsTimer);
      clearTimeout(pointsTimer);
    };
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ duration: 0.3 }}
        >
          <header className="flex justify-between items-center mb-8">
            <motion.h1 
              className="text-3xl font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              CRED Garage
            </motion.h1>
            <ThemeToggle />
          </header>

          <main className="space-y-8">
            {/* Profile Summary Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.user ? (
                  <ProfileSkeleton key="profile-skeleton" />
                ) : (
                  <ProfileSummary key="profile" user={userData} />
                )}
              </AnimatePresence>
            </section>

            {/* Benefits Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.benefits ? (
                  <div key="benefits-skeleton">
                    <motion.h2 
                      className="text-2xl font-bold mb-6 text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Your Benefits
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, index) => (
                        <BenefitCardSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <BenefitsSection key="benefits" benefits={benefitsData} />
                )}
              </AnimatePresence>
            </section>

            {/* Reward Points Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.points ? (
                  <RewardPointsSkeleton key="points-skeleton" />
                ) : (
                  <RewardPoints 
                    key="points" 
                    pointsData={pointsData} 
                    historyData={historyData} 
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Monthly Expenses Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.points ? (
                  <RewardPointsSkeleton key="expenses-skeleton" />
                ) : (
                  <MonthlyExpenses 
                    key="expenses" 
                    data={expensesData} 
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Transaction History Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.points ? (
                  <RewardPointsSkeleton key="transactions-skeleton" />
                ) : (
                  <TransactionHistory 
                    key="transactions" 
                    data={transactionData} 
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Credit Utilization Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.points ? (
                  <RewardPointsSkeleton key="utilization-skeleton" />
                ) : (
                  <CreditUtilization 
                    key="utilization" 
                    used={creditUtilization.used}
                    limit={creditUtilization.limit}
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Investment Portfolio Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.points ? (
                  <RewardPointsSkeleton key="investment-skeleton" />
                ) : (
                  <InvestmentPortfolio 
                    key="investment" 
                    data={investmentData} 
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Savings Goals Section */}
            <section>
              <AnimatePresence mode="wait">
                {loading.points ? (
                  <RewardPointsSkeleton key="savings-skeleton" />
                ) : (
                  <SavingsGoals 
                    key="savings" 
                    data={savingsData} 
                  />
                )}
              </AnimatePresence>
            </section>
          </main>

          <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 CRED Garage. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}

export default App;
