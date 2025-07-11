import React from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const SavingsGoals = ({ data }) => {
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
        className="bg-card rounded-xl p-6 shadow-md border border-border"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 text-card-foreground"
          variants={itemVariants}
        >
          Savings Goals
        </motion.h2>
        <motion.p className="text-muted-foreground" variants={itemVariants}>
          No savings goals available.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-card rounded-xl p-6 shadow-md border border-border"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <motion.h2 
        className="text-2xl font-bold mb-6 text-card-foreground"
        variants={itemVariants}
      >
        Savings Goals
      </motion.h2>
      <motion.div
        className="h-64"
        variants={itemVariants}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted-foreground) / 0.1)' }} />
            <Legend />
            <Bar dataKey="saved" name="Saved" barSize={20} fill="#FFB74D" />
            <Line type="monotone" dataKey="goal" name="Goal" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default SavingsGoals;
