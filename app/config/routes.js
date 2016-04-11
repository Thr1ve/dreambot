import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import Main from '../containers/Main';
import App from '../containers/App';
import Home from '../containers/Home';
import LoginContainer from '../containers/LoginContainer';
import CatchContainer from '../containers/CatchContainer';

const Routes = (
  <Route path="/" component={Main}>
    <IndexRedirect to="/app" />
    <Route path="/login" component={LoginContainer} />
    <Route path="/catch" component={CatchContainer} />
    <Route path="/app" component={App} >
      <IndexRoute component={Home} />
    </Route>
  </Route>
);

export default Routes;
