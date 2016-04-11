// From: https://github.com/reactjs/redux/blob/master/examples/real-world/containers/Root.dev.js

import React, { PropTypes } from 'react';
import routes from '../config/routes';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

const Root = React.createClass({
  propTypes: {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  },

  // TODO: Wrap Auth around this render function?
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    );
  }
});

export default Root;
