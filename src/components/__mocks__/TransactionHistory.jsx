import React from 'react';

const TransactionHistory = ({ data }) => (
  <div data-testid="transaction-history">
    <h2>Transaction History</h2>
    <p>{data.length} transactions</p>
  </div>
);

export default TransactionHistory;
