
import moment from 'moment';

export * from './date';

import {
  isUndefined,
  isDefined,
} from '../checks';

// Uses the date object to get the appropriate delimiter to group by
// assumes valid date object
// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
export function getDelimiter({ year, month, day, hour }) {
  if (isDefined(hour)) {
    return 'HOURS';
  } else if (isDefined(day)) {
    return 'DAYS';
  } else if (isDefined(month)) {
    return 'MONTHS';
  }
}

export function getParentDate({ year, month, day, hour }) {
  if (isDefined(hour)) {
    return { year, month, day };
  } else if (isDefined(day)) {
    return { year, month };
  } else if (isDefined(month)) {
    return { year };
  }
}

// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
export function getDateAsKey({ year, month, day, hour }) {
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

// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
const getDateFormat = delimiter => {
  switch (delimiter) {
    case 'HOURS':
      return 'YYYY-M-D-H';
    case 'DAYS':
      return 'YYYY-M-D';
    case 'MONTHS':
      return 'YYYY-M';
    default:
      return console.error('INVALID DELIMITER: ', delimiter);
  }
};

export function buildDatesArray({ start, end }, delimiter) {
  let results = [];
  const dateFormat = getDateFormat(delimiter);

  const startDate = moment(getDateAsKey(start), dateFormat);
  const endDate = moment(getDateAsKey(end), dateFormat);
  const delimitedDistance = endDate.diff(startDate, delimiter) + 1;

  for (let i = 0; i < delimitedDistance; i++) {
    results.push(startDate.format(dateFormat));
    startDate.add(1, delimiter);
  }

  return results;
}
