/* eslint-disable no-unused-vars */

import React from 'react';
import { connect } from 'react-redux';

import {
  getMessages,
  getSearchResults, // word:string
  getAvgMessagesByHour, // { year, month, day }
  getVolumeOfMessagesByHour, // { year, month, day }
  getAvgMessagesByDayOfWeek,
  getAllUniqueWords,
  queryWordCountByUser,
  queryUserMessagesById,
  getClassifications,
  getUserMessageReduction,
  getSingleUserMessageReduction, // userId:string
 } from '../actions/queries';

import ChannelActivityContainer from './ChannelActivityContainer';

const Home = React.createClass({
  componentWillMount() {
    // getSingleUserMessageReduction('U0S1U1H54')
    // getUserMessageReduction()
    // getClassifications()
    // queryUserMessagesById()
    // queryWordCountByUser()
    // getAvgMessagesByDayOfWeek()
    // getAllUniqueWords()
    // getAvgMessagesByHour({ year: 2016, month: 3, day: 17 })
    // getVolumeOfMessagesByHour({ year: 2016, month: 3, day: 17 })
    // getSearchResults('love')
    // getMessages()
      // .then(res => console.log(res))
      // .catch(err => console.log(err));
  },

  render() {
    return (
      <div>
        Home
        <ChannelActivityContainer />
      </div>
    );
  }
});

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Home);
