import React from 'react';
import { connect } from 'react-redux';
import AuthContainer from '../containers/AuthContainer';
import { logout } from '../actions';

const App = React.createClass({
  logout() {
    this.props.dispatch(logout());
  },

  render() {
    return (
      <AuthContainer>
        <button onClick={this.logout}> Logout </button>
        <br />
        {this.props.children}
      </AuthContainer>
    );
  }
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
