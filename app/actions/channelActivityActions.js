
import { getMessageVolumes } from './queries';
import { fillTime, getDateAsKey, getDelimiter, isValidDate } from '../utils/time';

export const REQUEST_VOLUMES = 'REQUEST_VOLUMES';
export const requestVolumes = (dateKey, delimiter) =>
  ({ type: REQUEST_VOLUMES, dateKey, delimiter });

export const RECEIVE_VOLUMES = 'RECEIVE_VOLUMES';
export const receiveVolumes = (data, dateKey, delimiter) =>
  ({ type: RECEIVE_VOLUMES, data, dateKey, delimiter });

const volumeKey = {
  HOURS: 'byHour',
  DAYS: 'byDay',
  MONTHS: 'byMonth'
};

function shouldFetchVolumes(state, date, delimiter) {
  const { volumes } = state.channelActivity;
  const dateKey = getDateAsKey(date, delimiter);

  return !volumes[volumeKey[delimiter]][dateKey];
}

const fetchVolumes = (date, delimiter) => dispatch => {
  const dateKey = getDateAsKey(date);

  dispatch(requestVolumes(dateKey, delimiter));

  return getMessageVolumes(date)
    .then(data => dispatch(
      receiveVolumes(
        fillTime(data, delimiter, date),
        dateKey,
        delimiter
      ))
    )
    .catch(err => console.log(err));
};

export const fetchVolumesIfNeeded = date => (dispatch, getState) => {
  if (!isValidDate(date)) {
    return console.error('Invalid Date');
  }
  const delimiter = getDelimiter(date);
  if (shouldFetchVolumes(getState(), date, delimiter)) {
    return dispatch(fetchVolumes(date, delimiter));
  }
};
