import React from 'react';

const InvestmentPortfolio = ({ data }) => (
  <div data-testid="investment-portfolio">
    <h2>Investment Portfolio</h2>
    <p>{data.length} data points</p>
  </div>
);

export default InvestmentPortfolio;
