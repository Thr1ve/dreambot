import React, { PropTypes } from 'react';
import EasyTransition from 'react-easy-transition';

const HeroContainer = ({ children, logout }) => {
  return (
    <EasyTransition
      path={''}
      initialStyle={{ transform: 'translateY(-200px)' }}
      transition="transform 0.3s ease-in-out"
      finalStyle={{ transform: 'translateY(0px)' }}
    >
      <div className="hero-header">
        <header className="header">
          <div className="container">
            <div className="header-left">
              <a className="title header-item">
                Glance
              </a>
            </div>
            <span className="header-toggle">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <div className="header-right header-menu">
              <span className="header-item">
                <a onClick={logout} className="button is-primary is-inverted">
                  <span>Logout</span>
                </a>
              </span>
            </div>
          </div>
        </header>
      </div>
    </EasyTransition>
  );
};

HeroContainer.propTypes = {
  logout: PropTypes.func
};

export default HeroContainer;
