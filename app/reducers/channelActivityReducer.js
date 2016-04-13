/* eslint-disable complexity */

import { REQUEST_VOLUMES, RECEIVE_VOLUMES } from '../actions';

export default function channelActivity(state = {
  delimiter: 'HOURS',
  volumes: volumesReducer(),
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
