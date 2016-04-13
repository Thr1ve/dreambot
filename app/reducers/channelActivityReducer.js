
import { REQUEST_VOLUMES_BY_HOUR, RECEIVE_VOLUMES_BY_HOUR } from '../actions';

export default function channelActivity(state = {
  delimiter: 'hour',
  volumesByDay: {},
  currentCollection: []
}, action) {
  switch (action.type) {
    case REQUEST_VOLUMES_BY_HOUR:
      return {
        ...state,
        volumesByDay: {
          ...state.volumesByDay,
          [action.date]: volumeReducer(state.volumesByDay[action.date], action)
        }
      };
    case RECEIVE_VOLUMES_BY_HOUR:
      return {
        ...state,
        volumesByDay: {
          ...state.volumesByDay,
          [action.date]: volumeReducer(state.volumesByDay[action.date], action)
        }
      };
    default:
      return state;
  }
}

function volumeReducer(state = {
  loading: false,
  byHour: []
}, action) {
  switch (action.type) {
    case REQUEST_VOLUMES_BY_HOUR: {
      return {
        ...state,
        loading: true,
      };
    }
    case RECEIVE_VOLUMES_BY_HOUR: {
      return {
        ...state,
        loading: false,
        total: action.hours.reduce((prev, cur) => prev + cur),
        byHour: action.hours
      };
    }
    default:
      return state;
  }
}

