
import { REQUEST_VOLUMES, RECEIVE_VOLUMES } from '../actions';

export default function channelActivity(state = {
  volumes: {},
  currentCollection: []
}, action) {
  switch (action.type) {
    case REQUEST_VOLUMES: {
      const date = `${action.year}-${action.month}-${action.day}`;
      return {
        ...state,
        volumes: {
          ...state.volumes,
          [date]: volumeReducer(state.volumes[date], action)
        }
      };
    }
    case RECEIVE_VOLUMES: {
      const date = `${action.year}-${action.month}-${action.day}`;
      return {
        ...state,
        volumes: {
          ...state.volumes,
          [date]: volumeReducer(state.volumes[date], action)
        }
      };
    }
    default:
      return state;
  }
}

function volumeReducer(state = {
  loading: false,
  hours: []
}, action) {
  switch (action.type) {
    case REQUEST_VOLUMES: {
      return {
        ...state,
        loading: true,
      };
    }
    case RECEIVE_VOLUMES: {
      return {
        ...state,
        loading: false,
        total: action.volumes.reduce((prev, cur) => prev + cur.reduction, 0),
        byHour: action.volumes
      };
    }
    default:
      return state;
  }
}

