import React from 'react';
import { connect } from 'react-redux';

import { fetchVolumes } from '../actions';
import ChannelActivity from '../components/ChannelActivity';

const ChannelActivityContainer = React.createClass({
  componentDidMount() {
    const date = {
      year: 2016,
      month: 3,
      day: 17
    };
    this.props.dispatch(fetchVolumes(date));
  },

  render() {
    const { volumes } = this.props.channelActivity;
    const keys = Object.keys(volumes);
    // we should probably just pass the `currentCollection` from state
    return (
      <ChannelActivity volumes={volumes} keys={keys} />
    );
  }
});

function mapStateToProps(state) {
  return {
    channelActivity: state.channelActivity
  };
}

export default connect(mapStateToProps)(ChannelActivityContainer);
