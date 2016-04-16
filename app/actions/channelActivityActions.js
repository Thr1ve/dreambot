
import { getMessageVolumes } from './queries';
import { buildDatesArray, GlanceDate } from '../utils/time';
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
  dispatch(requestVolumes(
    glance.transmute([], delimiter, true),
    delimiter
  ));

  return getMessageVolumes(glance.getParentDate())
    .then(data => dispatch(
      receiveVolumes(
        glance.transmute(objectifyRethinkReduction(data), delimiter, false),
        delimiter
      ))
    )
    .catch(err => console.log(err));
};

export const fetchVolumesIfNeeded = (glance) => (dispatch, getState) => {
  const { volumes } = getState().channelActivity;
  const delimiter = glance.getDefaultDelimiter();

  if (shouldFetchVolumes(volumes, glance.getKey(), delimiter)) {
    return dispatch(fetchVolumes(glance, delimiter));
  }
};


// CURRENT COLLECTION
export const SET_CURRENT_COLLECTION = 'SET_CURRENT_COLLECTION';
export const setCurrentCollection = dates =>
  ({ type: SET_CURRENT_COLLECTION, dates });

export const fetchOrSetCurrentCollection = (datesArray) => (dispatch) => {
  datesArray.forEach((dateKey) => {
    dispatch(fetchVolumesIfNeeded(new GlanceDate(dateKey)));
  });
  return dispatch(setCurrentCollection(datesArray));
};

const updateCurrentCollection = dateRange => (dispatch, getState) => {
  const { delimiter } = getState().channelActivity;
  const newDatesArray = buildDatesArray(dateRange, delimiter);
  return dispatch(fetchOrSetCurrentCollection(newDatesArray));
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
    dispatch(updateCurrentCollection({ start: start.date, end: end.date }));
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
  dispatch(fetchOrSetCurrentCollection(newDatesArray));
};
