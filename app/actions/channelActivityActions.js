
import { getMessageVolumes } from './queries';
import {
  fillTime, getDateAsKey, getDateFromKey,
  getDelimiter, isValidDate, buildDatesArray
} from '../utils/time';

export const SET_DATES = 'SET_DATES';
export const setDates = dates =>
  ({ type: SET_DATES, dates });

export const SET_DATE_RANGE = 'SET_DATE_RANGE';
export const setDateRange = (dateRange) =>
  ({ type: SET_DATE_RANGE, dateRange });

export const REQUEST_VOLUMES = 'REQUEST_VOLUMES';
export const requestVolumes = (dateKey, delimiter) =>
  ({ type: REQUEST_VOLUMES, dateKey, delimiter });

export const RECEIVE_VOLUMES = 'RECEIVE_VOLUMES';
export const receiveVolumes = (data, dateKey, delimiter) =>
  ({ type: RECEIVE_VOLUMES, data, dateKey, delimiter });

export const SET_DELIMITER = 'SET_DELIMITER';
export const setDelimiter = delimiter =>
  ({ type: SET_DELIMITER, delimiter });

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
    return console.error('Invalid Date', date);
  }
  const delimiter = getDelimiter(date);
  if (shouldFetchVolumes(getState(), date, delimiter)) {
    return dispatch(fetchVolumes(date, delimiter));
  }
};

export const fetchOrSetDates = (datesArray) => dispatch => {
  datesArray.forEach((dateKey) => {
    dispatch(fetchVolumesIfNeeded(getDateFromKey(dateKey)));
  });
  return dispatch(setDates(datesArray));
};

export const updateDelimiter = delimiter => (dispatch, getState) => {
  const { currentDateRange } = getState().channelActivity;
  const newDatesArray = buildDatesArray(currentDateRange, delimiter);
  dispatch(setDelimiter(delimiter));
  dispatch(fetchOrSetDates(newDatesArray));
};

const updateDates = dateRange => (dispatch, getState) => {
  const { delimiter } = getState().channelActivity;
  const newDatesArray = buildDatesArray(dateRange, delimiter);
  return dispatch(fetchOrSetDates(newDatesArray));
};

// Should we just have the dateRange hold its own delimiter and do the
// error handling elsewhere?
export const safeSetDateRange = dateRange => dispatch => {
  const { start, end } = dateRange;
  if (getDelimiter(start) === getDelimiter(end)) {
    dispatch(setDateRange(dateRange));
    dispatch(updateDates(dateRange));
  }
};

