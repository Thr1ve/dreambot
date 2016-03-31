import React from 'react';
import ReactRouter from 'react-router';
import MessagesContainer from '../containers/MessagesContainer';
import GraphContainer from '../containers/GraphContainer';
import NavbarContainer from '../containers/NavbarContainer';
import LeftPanelContainer from '../containers/LeftPanelContainer';
import SearchBoxContainer from '../containers/SearchBoxContainer';
import WordCountBarGraphContainer from '../containers/WordCountBarGraphContainer';
import { connection, r } from '../utils/rethink';
import { connect } from 'react-redux';
import {
  getHours,
  addMessage,
  fetchMessages,
  getWordCount,
  getMessageVolume,
  getEngagementByUser
} from '../actions';

const Home = React.createClass({
  componentWillMount() {
    console.log('HOME ABOUT TO MOUNT');
    const { dispatch } = this.props;
    dispatch(fetchMessages())
    // TODO: revise day to be dynamic again
      .then(() => {
        console.log('Fetched all messages from database');
        dispatch(getWordCount());
        dispatch(getMessageVolume());
        dispatch(getEngagementByUser());
      })
      .then(() => {
        console.log('Fetched all words');
        console.log('Fetched message volume');
      })
      .catch((err) => {
        console.log(err);
      });
    // TODO: move this to a separate file?
    connection()
      .then(conn => r.table('messages').changes().run(conn)
        .then(cursor => cursor.each((err, data) => dispatch(addMessage(data.new_val))))
      );
    let today = new Date();
    dispatch(getHours(
      {
        year: today.getYear() + 1900,
        month: today.getMonth() + 1,
        day: 12
      }
    ));
  },

  render() {
    return (
      <div className="container is-fluid">
        <NavbarContainer/>
        <h1 className="control">
          <SearchBoxContainer />
        </h1>
        <div className='columns'>
          <div className="column is-2">
            <LeftPanelContainer />
          </div>
          <div className="column is-text-centered">
            <GraphContainer />
          </div>
          <div className="column is-quarter">
            <MessagesContainer />
          </div>
        </div>
      </div>
    );
  }
});

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Home);
