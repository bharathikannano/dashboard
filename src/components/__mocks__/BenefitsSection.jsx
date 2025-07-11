import React from 'react';

const BenefitsSection = ({ benefits }) => (
  <div data-testid="benefits-section">
    <h2>Benefits Section</h2>
    <p>{benefits.length} benefits</p>
  </div>
);

export default BenefitsSection;
