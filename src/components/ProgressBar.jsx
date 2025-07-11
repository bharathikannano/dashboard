import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value }) => {
  return (
    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden" data-testid="progress-bar">
      <motion.div
        className="h-full rounded-full bg-primary"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: 0.2,
        }}
      />
    </div>
  );
};

export default ProgressBar;
