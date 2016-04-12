import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { HeroContainer, HeroHeader, HeroFooter } from '../../components/bulma';
import AuthContainer from '../../containers/AuthContainer';
import { logout } from '../../actions';

const App = React.createClass({
  logout() {
    this.props.dispatch(logout());
  },

  render() {
    return (
      <AuthContainer>

        <HeroContainer
          gradient
          height="fullheight"
          color="primary"
        >

          <HeroHeader logout={this.logout} />

          {this.props.children}

          <HeroFooter >
            <Link to="/hero/a">To A </Link>
            <Link to="/hero/b">To B </Link>
          </HeroFooter>

        </HeroContainer>

      </AuthContainer>
    );
  }
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
