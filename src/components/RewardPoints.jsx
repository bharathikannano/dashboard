import React, { useMemo } from 'react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

// Animation variants moved outside the component to prevent re-creation on every render.
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

// Colors for the pie chart
const COLORS = ['#FF5D51', '#FFB74D', '#4CAF50', '#2196F3'];

const RewardPoints = ({ pointsData, historyData, isLoading }) => {
  const { isDarkMode } = useTheme();

  // Memoize total points calculation to avoid re-computing on every render.
  const totalPoints = useMemo(() =>
    pointsData ? pointsData.reduce((sum, entry) => sum + entry.value, 0) : 0,
    [pointsData]
  );

  if (!pointsData && !isLoading) return null;

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
        Reward Points
      </motion.h2>

      {/* Pie Chart for Points Distribution */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <div className="text-center mb-4">
          <motion.div 
            className="text-4xl font-bold text-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
          >
            <AnimatedCounter value={totalPoints} />
          </motion.div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pointsData || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationBegin={300}
                animationDuration={1500}
              >
                {pointsData && pointsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {pointsData && pointsData.map((entry, index) => (
            <motion.div 
              key={index} 
              className="flex items-center space-x-2"

            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="text-xs">
                <div className="font-medium text-card-foreground">{entry.name}</div>
                <div className="text-muted-foreground">{entry.value} pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Line Chart for Points History */}
      {historyData && historyData.length > 0 && (
        <motion.div
          className="mt-8"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Points History</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                style={{ background: 'var(--chart-bg)', borderRadius: '12px' }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone"
                  dataKey="points"
                  stroke="#FF5D51"
                  strokeWidth={6}
                  dot={{ r: 8, fill: '#FF5D51', stroke: 'var(--chart-dot-border, #fff)', strokeWidth: 3 }}
                  activeDot={{ r: 10, strokeWidth: 4, fill: '#FF5D51', stroke: 'var(--chart-dot-border, #fff)' }}
                  animationDuration={1200}
                  connectNulls={true}
                  isAnimationActive={true}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RewardPoints;
