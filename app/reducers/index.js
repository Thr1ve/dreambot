import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import notifications from './notificationsReducer';
import auth from './authReducer';
import channelActivity from './channelActivityReducer';

const rootReducer = combineReducers({
  routing,
  notifications,
  auth,
  channelActivity,
});

export default rootReducer;

