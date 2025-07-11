import React from 'react';
import { motion } from 'framer-motion';

// Skeleton component for loading states
const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      className={`bg-muted/15 animate-pulse rounded-md ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ 
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5,
        ease: "easeInOut" 
      }}
      {...props}
    />
  );
};

// Preset skeleton components for common use cases
export const ProfileSkeleton = () => (
  <div className="flex flex-col space-y-4 p-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
  </div>
);

export const BenefitCardSkeleton = () => (
  <div className="p-4 rounded-xl border border-border">
    <Skeleton className="h-10 w-10 rounded-full mb-3" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-5/6 mb-3" />
    <Skeleton className="h-9 w-full rounded-md" />
  </div>
);

export const RewardPointsSkeleton = () => (
  <div className="p-4 rounded-xl border border-border">
    <Skeleton className="h-5 w-1/2 mb-4" />
    <div className="flex justify-center">
      <Skeleton className="h-40 w-40 rounded-full mb-4" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

export default Skeleton;