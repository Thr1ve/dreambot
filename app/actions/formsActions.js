
// Set the entire date range for the form
export const SET_ACTIVITY_FORM = 'SET_ACTIVITY_FORM';
export const setActivityForm = (range) =>
    ({ type: SET_ACTIVITY_FORM, range });

// Set an individual piece of the form
export const UPDATE_ACTIVITY_FORM = 'UPDATE_ACTIVITY_FORM';
export const updateActivityForm = (key, delimiter, value) =>
    ({ type: UPDATE_ACTIVITY_FORM, key, delimiter, value });

// Sync the form with the current displayed date range
export const syncActivityForm = () => (dispatch, getState) => {
  const { currentDateRange } = getState().channelActivity;
  dispatch(setActivityForm(currentDateRange));
};
