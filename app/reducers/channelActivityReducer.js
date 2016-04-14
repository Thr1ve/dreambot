/* eslint-disable complexity */

import {
  REQUEST_VOLUMES, RECEIVE_VOLUMES, SET_DELIMITER,
  SET_DATE_RANGE, SET_DATES
} from '../actions';

export default function channelActivity(state = {
  delimiter: 'HOURS',
  volumes: volumesReducer(),
  currentDateRange: {},
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
    case SET_DATES:
      return {
        ...state,
        currentCollection: action.dates
      };
    default:
      return state;
  }
}

function volumesReducer(state = {
  byHour: volumeReducer(),
  byDay: volumeReducer(),
  byMonth: volumeReducer()
}, action = {}) {
  switch (action.delimiter) {
    case 'HOURS':
      return {
        ...state,
        byHour: volumeReducer(state.byHour, action)
      };
    case 'DAYS':
      return {
        ...state,
        byDay: volumeReducer(state.byDay, action)
      };
    case 'MONTHS':
      return {
        ...state,
        byMonth: volumeReducer(state.byMonth, action)
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
        [action.dateKey]: {
          loading: true,
        }
      };
    case RECEIVE_VOLUMES:
      return {
        ...state,
        [action.dateKey]: {
          loading: false,
          data: action.data
        }
      };
    default:
      return state;
  }
}
