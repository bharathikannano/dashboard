import React from 'react';
import { motion } from 'framer-motion';

const TransactionHistory = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="bg-card rounded-xl p-6 shadow-md border border-border"
      variants={containerVariants}
      initial="hidden"
      animate="visible"

    >
      <motion.h2 
        className="text-2xl font-bold mb-6 text-card-foreground"
        variants={itemVariants}
      >
        Transaction History
      </motion.h2>
      <motion.div
        className="space-y-4"
        variants={itemVariants}
      >
        {data.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl mr-4">{transaction.icon}</div>
              <div>
                <div className="font-medium">{transaction.name}</div>
                <div className="text-sm text-muted-foreground">{transaction.date}</div>
              </div>
            </div>
            <div className={`font-medium ${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.amount}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TransactionHistory;
