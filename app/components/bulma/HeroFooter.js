import React, { PropTypes } from 'react';
import EasyTransition from 'react-easy-transition';

const HeroFooter = ({ children }) => {
  return (
    <EasyTransition
      path={''}
      initialStyle={{ transform: 'translateY(200px)' }}
      transition="transform 0.3s ease-in-out"
      finalStyle={{ transform: 'translateY(0px)' }}
    >
      <div className="hero-footer">
        <nav className="tabs is-boxed is-fullwidth">
          <div className="container">
            <ul>
              {children.map((child, i) => <li key={i}> {child} </li>)}
            </ul>
          </div>
        </nav>
      </div>
    </EasyTransition>
  );
};

HeroFooter.propTypes = {
};

export default HeroFooter;
