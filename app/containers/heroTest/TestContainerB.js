import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import EasyTransition from 'react-easy-transition';

// see http://bulma.io/documentation/layout/hero/
export const TestContainer = React.createClass({
  render() {
    return (
      <EasyTransition
        path={location.pathname}
        initialStyle={{ transform: 'translateX(200px)' }}
        transition="transform 0.2s cubic-bezier(0.310, 0.190, 0.460, 1.635)"
        finalStyle={{ transform: 'translateX(0px)' }}
        leaveStyle={{ transform: 'translateX(-200px)' }}
      >
        <div className="hero-content">
          <div className="container">
            <h1 className="title">
              This is the B page!!
            </h1>
            <h2 className="subtitle">
              so kewl!
            </h2>
          </div>
        </div>
      </EasyTransition>
    );
  }
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(TestContainer);

          // path={location.pathname}
          // initialStyle={{ opacity: 0 }}
          // transition="opacity 1.3s ease-in"
          // finalStyle={{ opacity: 1 }}
