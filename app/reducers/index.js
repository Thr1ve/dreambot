import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import notifications from './notificationsReducer';
import auth from './authReducer';
import channelActivity from './channelActivityReducer';
import forms from './formsReducer';

const rootReducer = combineReducers({
  routing,
  notifications,
  auth,
  channelActivity,
  forms,
});

export default rootReducer;

