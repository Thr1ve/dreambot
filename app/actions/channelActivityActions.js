
import { getVolumeOfMessagesByHour } from './queries';

export const REQUEST_VOLUMES = 'REQUEST_VOLUMES';
export const requestVolumes = ({ year, month, day }) =>
  ({ type: REQUEST_VOLUMES, year, month, day });

export const RECEIVE_VOLUMES = 'RECEIVE_VOLUMES';
export const receiveVolumes = (volumes, { year, month, day }) =>
  ({ type: RECEIVE_VOLUMES, volumes, year, month, day });

export const fetchVolumes = (date) => dispatch => {
  dispatch(requestVolumes(date));
  getVolumeOfMessagesByHour(date)
    .then(data => dispatch(receiveVolumes(data, date)))
    .catch(err => console.log(err));
};
