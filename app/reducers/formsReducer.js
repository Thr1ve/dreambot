
import { UPDATE_ACTIVITY_FORM, SET_ACTIVITY_FORM } from '../actions';

export default function (state = {
  channelActivity: channelActivityReducer()
}, action = {}) {
  switch (action.type) {
    case UPDATE_ACTIVITY_FORM:
      return {
        ...state,
        channelActivity: channelActivityReducer(state.channelActivity, action)
      };
    case SET_ACTIVITY_FORM:
      return {
        ...state,
        channelActivity: channelActivityReducer(state.channelActivity, action)
      };
    default:
      return state;
  }
}

function channelActivityReducer(state = {
  valid: true,
  error: '',
  start: rangeReducer(),
  end: rangeReducer()
}, action = {}) {
  switch (action.type) {
    case UPDATE_ACTIVITY_FORM:
      return {
        ...state,
        [action.key]: rangeReducer(state[action.key], action)
      };
    case SET_ACTIVITY_FORM:
      return {
        ...state,
        start: action.range.start,
        end: action.range.end
      };
    default:
      return state;
  }
}

function rangeReducer(state = {}, action = {}) {
  switch (action.type) {
    case UPDATE_ACTIVITY_FORM:
      return {
        ...state,
        [action.delimiter]: action.value
      };
    default:
      return state;
  }
}
