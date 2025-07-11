import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';

const ProfileSummary = ({ user, isLoading }) => {
  if (!user && !isLoading) return null;

  // Animation variants
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

  // Calculate progress percentage
  const progressPercentage = user ? (user.currentXP / user.targetXP) * 100 : 0;

  return (
    <motion.div
      className="bg-card rounded-xl p-6 shadow-md border border-border"
      variants={containerVariants}
      initial="hidden"
      animate="visible"

    >
      <motion.div className="flex items-center space-x-4" variants={itemVariants}>
        <motion.div 
          className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {user && (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
        
        <div className="flex-1">
          <motion.h2 
            className="text-xl font-bold text-card-foreground"
            variants={itemVariants}
          >
            {user ? user.name : 'Loading...'}
          </motion.h2>
          
          <motion.div 
            className="flex items-center space-x-2"
            variants={itemVariants}
          >
            <span className="text-sm font-medium text-primary">
              {user ? `Level ${user.level}` : ''}
            </span>
            {user && (
              <span className="text-xs text-muted-foreground">
                {user.currentXP} / {user.targetXP} XP
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="mt-4"
        variants={itemVariants}
      >
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress to Next Level</span>
          <span>{user ? `${Math.round(progressPercentage)}%` : ''}</span>
        </div>
        <ProgressBar value={progressPercentage} />
      </motion.div>

      {user && user.badges && user.badges.length > 0 && (
        <motion.div 
          className="mt-4 flex flex-wrap gap-2"
          variants={itemVariants}
        >
          {user.badges.map((badge, index) => (
            <motion.span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileSummary;
