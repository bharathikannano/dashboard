import React from 'react';
import { motion } from 'framer-motion';

const BulletChart = ({ name, saved, goal }) => {
  let percentage;
  if (goal === 0) {
    percentage = saved > 0 ? 100 : 0;
  } else {
    percentage = Math.min((saved / goal) * 100, 100);
  }

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-card-foreground">{name}</span>
        <span className="text-sm text-muted-foreground">
          ₹{saved.toLocaleString()} / ₹{goal.toLocaleString()}
        </span>
      </div>
      <div className="h-4 w-full rounded-full bg-muted overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        />
      </div>
    </div>
  );
};

export default BulletChart;
