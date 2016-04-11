
import { getVolumeOfMessagesByHour } from './queries';
import { fillHours, getDateAsKey } from '../utils/time';

export const REQUEST_VOLUMES_BY_HOUR = 'REQUEST_VOLUMES';
export const requestVolumesByHour = (date) =>
  ({ type: REQUEST_VOLUMES_BY_HOUR, date });

export const RECEIVE_VOLUMES_BY_HOUR = 'RECEIVE_VOLUMES';
export const receiveVolumesByHour = (hours, date) =>
  ({ type: RECEIVE_VOLUMES_BY_HOUR, date, hours });

function shouldFetchVolumes(state, date) {
  const { byHour } = state.channelActivity.volumesByDay[getDateAsKey(date)] || {};
  if (!byHour) {
    return true;
  }
  return false;
}

const fetchVolumes = date => dispatch => {
  const dateKey = getDateAsKey(date);

  dispatch(requestVolumesByHour(dateKey));

  getVolumeOfMessagesByHour(date)
    .then(data => dispatch(receiveVolumesByHour(fillHours(data), dateKey)))
    .catch(err => console.log(err));
};

export const fetchVolumesIfNeeded = date => (dispatch, getState) => {
  if (shouldFetchVolumes(getState(), date)) {
    dispatch(fetchVolumes(date));
  }
};
