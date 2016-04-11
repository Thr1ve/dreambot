import React from 'react';
import { connect } from 'react-redux';

import { fetchVolumesIfNeeded } from '../actions';
import ChannelActivity from '../components/ChannelActivity';

const ChannelActivityContainer = React.createClass({
  componentDidMount() {
    const date = {
      year: 2016,
      month: 3,
      day: 17
    };
    this.props.dispatch(fetchVolumesIfNeeded(date));
  },

  render() {
    const { volumesByDay } = this.props;
    const keys = Object.keys(volumesByDay);
    // we should probably just pass the `currentCollection` from state
    return (
      <ChannelActivity volumes={volumesByDay} keys={keys} />
    );
  }
});

function mapStateToProps(state) {
  return {
    volumesByDay: state.channelActivity.volumesByDay
  };
}

export default connect(mapStateToProps)(ChannelActivityContainer);
