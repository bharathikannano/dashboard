import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover text-popover-foreground p-3 rounded-lg border border-border shadow-lg">
        <p className="font-bold text-base mb-1">{label || data.name}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: p.color }}
              ></span>
              <span className="text-sm">{p.name}</span>
            </div>
            <span className="text-sm font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
