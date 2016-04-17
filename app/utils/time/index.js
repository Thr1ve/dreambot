
import moment from 'moment';

export * from './date';

import { isDefined } from '../checks';

// Uses the date object to get the appropriate delimiter to group by
// assumes valid date object
export function getDelimiter({ year, month, day, hour }) {
  if (isDefined(hour)) {
    return 'HOURS';
  } else if (isDefined(day)) {
    return 'DAYS';
  } else if (isDefined(month)) {
    return 'MONTHS';
  }
}

// TODO: This is duplicated logic from glance...
function getDateAsKey({ year, month, day, hour }) {
  if (isDefined(hour)) {
    return `${year}-${month}-${day}-${hour}`;
  } else if (isDefined(day)) {
    return `${year}-${month}-${day}`;
  } else if (isDefined(month)) {
    return `${year}-${month}`;
  } else if (isDefined(year)) {
    return `${year}`;
  }
}

const getDateFormat = delimiter => {
  switch (delimiter) {
    case 'HOURS':
      return 'YYYY-M-D-H';
    case 'DAYS':
      return 'YYYY-M-D';
    case 'MONTHS':
      return 'YYYY-M';
    case 'YEARS':
      return 'YYYY';
    default:
      return console.error('INVALID DELIMITER: ', delimiter);
  }
};

// TODO: This is duplicated logic from glance...
export function buildDatesArray({ start, end }, delimiter) {
  let results = [];
  const dateFormat = getDateFormat(delimiter);

  const startDate = moment(start.wrap().getKey(), dateFormat);
  const endDate = moment(end.wrap({ end: true }).getKey(), dateFormat);

  // TODO: abstract this logic to function or find a way to isolate it elsewhere
  const dflt = delimiter === 'HOURS' ? 0 : 1;
  const delimitedDistance = endDate.diff(startDate, delimiter) + dflt;

  for (let i = 0; i < delimitedDistance; i++) {
    results.push(startDate.format(dateFormat));
    startDate.add(1, delimiter);
  }

  return results;
}
