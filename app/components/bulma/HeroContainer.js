import React, { PropTypes } from 'react';

const HeroContainer = ({ color, gradient, children, height }) => {
  const g = gradient ? 'is-bold' : '';
  const c = color ? `is-${color}` : '';
  const h = height ? `is-${height}` : '';

  // see http://bulma.io/documentation/layout/hero/
  return (
    <section className={`hero ${c} ${g} ${h}`}>
      { children
        // children.map((child, i) =>
        //   React.cloneElement(child, { height, key: i }))
      }
    </section>
  );
};

HeroContainer.propTypes = {
  gradient: PropTypes.bool,
  height: PropTypes.oneOf(['medium', 'large', 'fullheight']),
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger'])
};

export default HeroContainer;
