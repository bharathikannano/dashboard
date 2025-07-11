import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Initialize animation controls
    const controls = animate(0, value, {
      duration: 1.5,
      onUpdate(currentValue) {
        if (ref.current) {
          ref.current.textContent = Math.round(currentValue).toLocaleString();
        }
      },
    });

    // Only call stop if controls exist
    return () => {
      if (controls && typeof controls.stop === 'function') {
        controls.stop();
      }
    };
  }, [value]);

  return <span ref={ref} data-testid="animated-counter" />;
};

export default AnimatedCounter;
