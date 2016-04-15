
import { getMessageVolumes } from './queries';
import {
  fillTime, getDateAsKey, getDateFromKey,
  getDelimiter, getParentDate, isValidDate,
  transmuteTime, buildDatesArray, GlanceDate
} from '../utils/time';

import { objectifyRethinkReduction } from '../utils/rethink';

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
const shouldFetchVolumes = (volumes, dateKey, delimiter) =>
  !volumes[delimiter][dateKey];

const fetchVolumes = (glance, delimiter) => dispatch => {
  const parentDateKey = glance.getKey({ parent: true });

  const filledTest = fillTime([], delimiter, glance.date);
  const emptyData = transmuteTime(parentDateKey, filledTest, true);

  dispatch(requestVolumes(emptyData, delimiter));

  return getMessageVolumes(glance.getParentDate())
    .then(data => {
      const filled = fillTime(objectifyRethinkReduction(data), delimiter, glance.date);
      const transmuted = transmuteTime(parentDateKey, filled, false);
      return dispatch(receiveVolumes(transmuted, delimiter));
    })
    .catch(err => console.log(err));
};

export const fetchVolumesIfNeeded = (glance) => (dispatch, getState) => {
  const { volumes } = getState().channelActivity;
  const delimiter = glance.getDefaultDelimiter();

  if (shouldFetchVolumes(volumes, glance.getKey(), delimiter)) {
    return dispatch(fetchVolumes(glance, delimiter));
  }
};


// DATES
export const SET_DATES = 'SET_DATES';
export const setDates = dates =>
  ({ type: SET_DATES, dates });

export const fetchOrSetDates = (datesArray) => (dispatch) => {
  datesArray.forEach((dateKey) => {
    dispatch(fetchVolumesIfNeeded(new GlanceDate(dateKey)));
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
export const safeSetDateRange = ({ start, end }) => dispatch => {
  if (start.getDefaultDelimiter() === end.getDefaultDelimiter()) {
    dispatch(setDateRange({ start: start.date, end: end.date }));
    dispatch(updateDates({ start: start.date, end: end.date }));
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
