import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import notifications from './notificationsReducer';
import auth from './authReducer';

const rootReducer = combineReducers({
  routing,
  notifications,
  auth
});

export default rootReducer;

