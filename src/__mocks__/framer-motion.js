const React = require('react');

// List of all framer-motion props to strip
const MOTION_PROPS = [
  'whileHover', 'whileTap', 'whileDrag', 'whileFocus', 'whileInView',
  'layout', 'layoutId', 'layoutDependency', 'layoutRoot',
  'variants', 'initial', 'animate', 'exit', 'transition',
  'drag', 'dragConstraints', 'dragElastic', 'dragMomentum', 'dragPropagation',
  'onAnimationStart', 'onAnimationComplete', 'onUpdate', 'onDrag', 'onDragStart', 'onDragEnd',
  'custom', 'as', 'tabIndex', 'viewport', 'transformTemplate', 'transformValues',
];

const stripMotionProps = (props) => {
  const newProps = {};
  for (const key in props) {
    if (!MOTION_PROPS.includes(key)) {
      newProps[key] = props[key];
    }
  }
  return newProps;
};

const mockMotionComponent = React.forwardRef(({ children, style, ...props }, ref) =>
  React.createElement('div', { ...stripMotionProps(props), style, ref }, children)
);

const motion = new Proxy(
  {},
  {
    get: (target, name) => {
      if (typeof name === 'string') {
        return mockMotionComponent;
      }
      return undefined;
    },
  }
);

module.exports = {
  motion,
  AnimatePresence: ({ children }) => children,
};
