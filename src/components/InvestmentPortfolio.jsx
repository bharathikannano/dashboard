import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

const InvestmentPortfolio = ({ data }) => {
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

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="bg-card rounded-xl p-6 shadow-md border border-border flex flex-col items-center justify-center h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"

      >
        <motion.h2 
          className="text-2xl font-bold mb-2 text-card-foreground"
          variants={itemVariants}
        >
          Investment Portfolio
        </motion.h2>
        <p className="text-muted-foreground">No investment data available.</p>
      </motion.div>
    );
  }

  const latestValue = data[data.length - 1].value;
  const initialValue = data[0].value;
  const growth = latestValue - initialValue;
  const growthPercentage = initialValue !== 0 ? ((growth / initialValue) * 100).toFixed(2) : '0.00';

  return (
    <motion.div
      className="bg-card rounded-xl p-6 shadow-md border border-border"
      variants={containerVariants}
      initial="hidden"
      animate="visible"

    >
      <motion.h2 
        className="text-2xl font-bold mb-2 text-card-foreground"
        variants={itemVariants}
      >
        Investment Portfolio
      </motion.h2>
      <motion.div className="flex items-baseline mb-6" variants={itemVariants}>
        <p className="text-3xl font-bold text-primary">₹{latestValue.toLocaleString()}</p>
        <p className={`ml-2 text-sm font-semibold ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {growth >= 0 ? '+' : ''}{growth.toLocaleString()} ({growthPercentage}%)
        </p>
      </motion.div>
      <motion.div
        className="h-64"
        variants={itemVariants}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default InvestmentPortfolio;
