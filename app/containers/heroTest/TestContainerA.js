import React from 'react';
import { connect } from 'react-redux';
import EasyTransition from 'react-easy-transition';

import TestDisplayContainer from './TestDisplayContainer';
import TestGraphContainer from './TestGraphContainer';
import DateRangeForm from './DateRangeForm';
import Dropdown from '../../components/bulma/Dropdown';
import { GlanceDate } from '../../utils/time';

import { syncActivityForm, updateDelimiter, resetDateRange, setView } from '../../actions';

export const TestContainer = React.createClass({
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(fetchVolumesIfNeeded({ year: 2016, month: 3, day: 17 }));
    dispatch(resetDateRange({
      // start: new GlanceDate({ year: 2016, month: 3, day: 17, hour: 1 }),
      // end: new GlanceDate({ year: 2016, month: 3, day: 17, hour: 20 })

      start: new GlanceDate({ year: 2016, month: 3, day: 11 }),
      end: new GlanceDate({ year: 2016, month: 3, day: 20 })

      // start: new GlanceDate({ year: 2016, month: 3 }),
      // end: new GlanceDate({ year: 2016, month: 4 })
    }));
    dispatch(syncActivityForm());
  },

  handleDelimiterChange(e) {
    this.props.dispatch(updateDelimiter(e.target.value));
  },

  handleViewChange(e) {
    this.props.dispatch(setView(e.target.value));
  },

  getView(view) {
    if (view === 'RAW') {
      return <TestDisplayContainer />;
    } else if (view === 'GRAPH') {
      return <TestGraphContainer />;
    }
    return <div> No view selected </div>;
  },

  render() {
    const { delimiter, view } = this.props;
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
                <DateRangeForm />
                <Dropdown value={delimiter} label="Delimiter" onChange={this.handleDelimiterChange}>
                  <option value="HOURS"> Hour </option>
                  <option value="DAYS"> Day </option>
                  <option value="MONTHS"> Month </option>
                </Dropdown>
                <Dropdown value={view} label="View" onChange={this.handleViewChange}>
                  <option value="RAW"> Raw </option>
                  <option value="GRAPH"> Graph </option>
                </Dropdown>
                { /* <p className="notification is-danger"> First column </p> */ }
              </div>
              <div className="column is-8">
                { /* <p className="notification is-primary"> Second column </p> */ }
                {this.getView(view)}
              </div>
            </div>
          </div>
        </div>
      </EasyTransition>
    );
  }
});

function mapStateToProps(state) {
  const { delimiter, view } = state.channelActivity;
  return {
    delimiter,
    view
  };
}

export default connect(mapStateToProps)(TestContainer);
