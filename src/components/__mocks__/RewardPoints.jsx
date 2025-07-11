import React from 'react';

const RewardPoints = ({ pointsData, historyData }) => (
  <div data-testid="reward-points">
    <h2>Reward Points</h2>
    <p>{pointsData.length} point categories</p>
    <p>{historyData.length} history entries</p>
  </div>
);

export default RewardPoints;
