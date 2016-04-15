
import { getMessageVolumes } from './queries';
import {
  fillTime, getDateAsKey, getDateFromKey,
  getDelimiter, isValidDate, buildDatesArray,
  transmuteTime
} from '../utils/time';

// VOLUMES:
export const REQUEST_VOLUMES = 'REQUEST_VOLUMES';
export const requestVolumes = (data, delimiter) =>
  ({ type: REQUEST_VOLUMES, data, delimiter });

export const RECEIVE_VOLUMES = 'RECEIVE_VOLUMES';
export const receiveVolumes = (data, delimiter) =>
  ({ type: RECEIVE_VOLUMES, data, delimiter });

// If we want to handle invalidating our data, we would
// expand this function. However, as the data for a past
// date should never change, we're opting not to do that.
const shouldFetchVolumes = (state, dateKey, delimiter) =>
  !state.channelActivity.volumes[delimiter][dateKey];

const fetchVolumes = (date, delimiter) => dispatch => {
  const dateKey = getDateAsKey(date);

  const filledTest = fillTime([], delimiter, date);
  const transmutedTest = transmuteTime(dateKey, filledTest, true);

  dispatch(requestVolumes(transmutedTest, delimiter));

  return getMessageVolumes(date)
    .then(data => {
      const filled = fillTime(data, delimiter, date);
      const transmuted = transmuteTime(dateKey, filled, false);
      return dispatch(receiveVolumes(transmuted, delimiter));
    })
    .catch(err => console.log(err));
};

export const fetchVolumesIfNeeded = date => (dispatch, getState) => {
  if (!isValidDate(date)) {
    return console.error('Invalid Date', date);
  }
  const delimiter = getDelimiter(date);
  if (shouldFetchVolumes(getState(), getDateAsKey(date, delimiter), delimiter)) {
    return dispatch(fetchVolumes(date, delimiter));
  }
};


// DATES
export const SET_DATES = 'SET_DATES';
export const setDates = dates =>
  ({ type: SET_DATES, dates });

export const fetchOrSetDates = (datesArray) => dispatch => {
  datesArray.forEach((dateKey) => {
    dispatch(fetchVolumesIfNeeded(getDateFromKey(dateKey)));
  });
  return dispatch(setDates(datesArray));
};

const updateDates = dateRange => (dispatch, getState) => {
  const { delimiter } = getState().channelActivity;
  const newDatesArray = buildDatesArray(dateRange, delimiter);
  return dispatch(fetchOrSetDates(newDatesArray));
};

// DATE RANGE
export const SET_DATE_RANGE = 'SET_DATE_RANGE';
export const setDateRange = (dateRange) =>
  ({ type: SET_DATE_RANGE, dateRange });

// Should we just have the dateRange hold its own delimiter and do the
// error handling elsewhere?
export const safeSetDateRange = dateRange => dispatch => {
  const { start, end } = dateRange;
  if (getDelimiter(start) === getDelimiter(end)) {
    dispatch(setDateRange(dateRange));
    dispatch(updateDates(dateRange));
  }
};

// DELIMITER
export const SET_DELIMITER = 'SET_DELIMITER';
export const setDelimiter = delimiter =>
  ({ type: SET_DELIMITER, delimiter });

export const updateDelimiter = delimiter => (dispatch, getState) => {
  const { currentDateRange } = getState().channelActivity;
  const newDatesArray = buildDatesArray(currentDateRange, delimiter);
  dispatch(setDelimiter(delimiter));
  dispatch(fetchOrSetDates(newDatesArray));
};
