/* eslint-disable complexity */

import {
  REQUEST_VOLUMES, RECEIVE_VOLUMES, SET_DELIMITER,
  SET_DATE_RANGE, SET_CURRENT_COLLECTION, SET_VIEW
} from '../actions';

export default function channelActivity(state = {
  delimiter: '',
  view: 'RAW',
  volumes: volumesReducer(),
  currentDateRange: {
    start: {},
    end: {}
  },
  currentCollection: []
}, action = {}) {
  switch (action.type) {
    case REQUEST_VOLUMES:
      return {
        ...state,
        volumes: volumesReducer(state.volumes, action)
      };
    case RECEIVE_VOLUMES:
      return {
        ...state,
        volumes: volumesReducer(state.volumes, action)
      };
    case SET_DELIMITER:
      return {
        ...state,
        delimiter: action.delimiter
      };
    case SET_DATE_RANGE:
      return {
        ...state,
        currentDateRange: action.dateRange
      };
    case SET_CURRENT_COLLECTION:
      return {
        ...state,
        currentCollection: action.dates
      };
    case SET_VIEW:
      return {
        ...state,
        view: action.view
      };
    default:
      return state;
  }
}

function volumesReducer(state = {
  HOURS: volumeReducer(),
  DAYS: volumeReducer(),
  MONTHS: volumeReducer()
}, action = {}) {
  switch (action.delimiter) {
    case 'HOURS':
      return {
        ...state,
        HOURS: volumeReducer(state.HOURS, action)
      };
    case 'DAYS':
      return {
        ...state,
        DAYS: volumeReducer(state.DAYS, action)
      };
    case 'MONTHS':
      return {
        ...state,
        MONTHS: volumeReducer(state.MONTHS, action)
      };
    default:
      return state;
  }
}

// poorly named......
function volumeReducer(state = {}, action = {}) {
  switch (action.type) {
    case REQUEST_VOLUMES:
      return {
        ...state,
        ...action.data
      };
    case RECEIVE_VOLUMES:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}
