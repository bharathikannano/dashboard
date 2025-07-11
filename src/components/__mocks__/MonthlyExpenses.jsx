import React from 'react';

const MonthlyExpenses = ({ data }) => (
  <div data-testid="monthly-expenses">
    <h2>Monthly Expenses</h2>
    <p>{data.length} expense categories</p>
  </div>
);

export default MonthlyExpenses;
