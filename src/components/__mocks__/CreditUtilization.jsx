import React from 'react';

const CreditUtilization = ({ used, limit }) => (
  <div data-testid="credit-utilization">
    <h2>Credit Utilization</h2>
    <p>Used: {used}</p>
    <p>Limit: {limit}</p>
  </div>
);

export default CreditUtilization;
