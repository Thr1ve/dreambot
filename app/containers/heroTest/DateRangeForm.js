/* eslint-disable complexity */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import DateInputGroup from './DateInputGroup';
import { updateActivityForm, resetDateRange } from '../../actions';
import { isValidDate, GlanceDate } from '../../utils/time';

const DateRangeForm = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    start: PropTypes.object,
    end: PropTypes.object,
    valid: PropTypes.bool,
    error: PropTypes.string
  },

  createChangeFunction(key) {
    return ({ name, value }) => {
      this.props.dispatch(updateActivityForm(key, name, value));
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    const { dispatch, start, end } = this.props;
    dispatch(resetDateRange({
      start: new GlanceDate(start),
      end: new GlanceDate(end)
    }));
  },

  render() {
    const { start, end, valid, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
        { /*
          { !valid && (
            <p className="is-danger"> {error} </p>
          )}
        */ }
          <div className="control is-horizontal">
            <div className="control-label">
              <label className="label">From: </label>
            </div>
            <DateInputGroup data={start} onChange={this.createChangeFunction('start')} />
          </div>
          <div className="control is-horizontal">
            <div className="control-label">
              <label className="label">To:</label>
            </div>
            <DateInputGroup data={end} onChange={this.createChangeFunction('end')} />
          </div>
        </div>
        <input type="submit" disabled={!valid} style={{ visibility: 'hidden' }} />
      </form>
    );
  }
});

function mapStateToProps(state) {
  const { start, end } = state.forms.channelActivity;
  // TODO: make GlanceDate validate method to use here
  // let error = '';
  let valid = true;
  // const cleanedStart = clean(start);
  // const cleanedEnd = clean(end);

  // if (!isValidDate(cleanedStart)) {
  //   console.log('HERE');
  //   valid = false;
  //   error = 'INVALID DATE';
  // }

  return {
    start,
    end,
    valid,
    // error
  };
}

export default connect(mapStateToProps)(DateRangeForm);

function clean(obj) {
  let result = Object.keys(obj).reduce((prev, cur) => {
    if (!prev[cur]) {
      if (typeof obj[cur] === 'string') {
        if (obj[cur].length > 0) {
          prev[cur] = obj[cur];
        }
      } else if (typeof obj[cur] === 'number') {
        prev[cur] = obj[cur];
      }
    }
    return prev;
  }, {});
  return result;
}
