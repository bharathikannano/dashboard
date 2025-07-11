import React from 'react';
import { motion } from 'framer-motion';

const BenefitCard = ({ benefit }) => {
  return (
    <motion.div 
      className="bg-card rounded-xl p-6 border border-border shadow-sm h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="mb-4">
        <motion.div 
          className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-primary"
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          {benefit.icon}
        </motion.div>
      </div>
      
      <motion.h3 
        className="text-lg font-semibold mb-2 text-card-foreground"
        layout
      >
        {benefit.title}
      </motion.h3>
      
      <motion.p 
        className="text-sm text-muted-foreground mb-4 flex-grow"
        layout
      >
        {benefit.description}
      </motion.p>
      
      <motion.button
        className="mt-auto w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {benefit.cta}
      </motion.button>
    </motion.div>
  );
};

const BenefitsSection = ({ benefits, isLoading }) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="my-8">
      <motion.h2 
        className="text-2xl font-bold mb-6 text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Your Benefits
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        {benefits && benefits.map((benefit, index) => (
          <BenefitCard key={index} benefit={benefit} />
        ))}
      </motion.div>
    </div>
  );
};

export default BenefitsSection;