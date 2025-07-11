import React from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const CreditUtilization = ({ used, limit }) => {
  const percentage = limit === 0 ? (used > 0 ? 100 : 0) : Math.round((used / limit) * 100);

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

  const data = [{ name: 'utilization', value: percentage }];

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
        Credit Utilization
      </motion.h2>
      <motion.div
        className="h-64"
        variants={itemVariants}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="80%" 
            outerRadius="100%" 
            data={[{ name: 'utilization', value: percentage }]} 
            startAngle={90} 
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar 
              background 
              dataKey='value' 
              cornerRadius={10} 
              fill="hsl(var(--primary))" 
            />
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="text-4xl font-bold fill-current text-primary"
            >
              {`${percentage}%`}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="text-center mt-4">
        <p className="text-lg font-medium text-card-foreground">
          ₹{used.toLocaleString()} / ₹{limit.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">
          Used of your credit limit
        </p>
      </div>
    </motion.div>
  );
};

export default CreditUtilization;
