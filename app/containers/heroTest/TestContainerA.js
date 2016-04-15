import React from 'react';
import { connect } from 'react-redux';
import EasyTransition from 'react-easy-transition';

import TestDisplayContainer from './TestDisplayContainer';
import { fetchVolumesIfNeeded, updateDelimiter, safeSetDateRange } from '../../actions';
import Dropdown from '../../components/bulma/Dropdown';
import { GlanceDate } from '../../utils/time';

export const TestContainer = React.createClass({
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(fetchVolumesIfNeeded({ year: 2016, month: 3, day: 17 }));
    dispatch(safeSetDateRange({
      start: new GlanceDate({ year: 2016, month: 3, day: 17, hour: 1 }),
      end: new GlanceDate({ year: 2016, month: 3, day: 17, hour: 8 })
    }));
  },

  handleDropDownChange(e) {
    this.props.dispatch(updateDelimiter(e.target.value));
  },

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
            <div className="columns">
              <div className="column is-4">
                <Dropdown label="Delimiter" onChange={this.handleDropDownChange}>
                  <option value="HOURS"> hour </option>
                  <option value="DAYS"> day </option>
                  <option value="MONTHS"> month </option>
                </Dropdown>
                { /* <p className="notification is-danger"> First column </p> */ }
              </div>
              <div className="column is-8">
                { /* <p className="notification is-primary"> Second column </p> */ }
                <TestDisplayContainer />
              </div>
            </div>
            <h1 className="title">
              This is the A page!
            </h1>
            <h2 className="subtitle">
              Isn't it awesome!?
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
