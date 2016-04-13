
import { getMessageVolumes } from './queries';
import { fillHours, getDateAsKey, getDelimiter, isValidDate } from '../utils/time';

export const REQUEST_VOLUMES = 'REQUEST_VOLUMES';
export const requestVolumes = (date) => ({ type: REQUEST_VOLUMES, date });

export const RECEIVE_VOLUMES = 'RECEIVE_VOLUMES';
export const receiveVolumes = (hours, date) => ({ type: RECEIVE_VOLUMES, date, hours });

function shouldFetchVolumes(state, date) {
  const { byHour } = state.channelActivity.volumesByDay[getDateAsKey(date)] || {};
  if (!byHour) {
    return true;
  }
  return false;
}

const fetchVolumes = date => dispatch => {
  if (!isValidDate(date)) {
    return console.error('Invalid Date');
  }
  const delimiter = getDelimiter(date);
  const dateKey = getDateAsKey(date);

  dispatch(requestVolumes(dateKey));

  return getMessageVolumes(date)
    .then(data => dispatch(receiveVolumes(fillHours(data), dateKey)))
    .catch(err => console.log(err));
};

export const fetchVolumesIfNeeded = date => (dispatch, getState) => {

  if (shouldFetchVolumes(getState(), date)) {
    dispatch(fetchVolumes(date));
  }
};
