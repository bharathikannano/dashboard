import React from 'react';

const SavingsGoals = ({ data }) => (
  <div data-testid="savings-goals">
    <h2>Savings Goals</h2>
    <p>{data.length} goals</p>
  </div>
);

export default SavingsGoals;
