
import moment from 'moment';

export * from './date';

import {
  isUndefined,
  isDefined,
} from '../checks';

export function objectifyRethinkReduction(arr) {
  return arr.reduce((prev, cur) => {
    if (!prev[cur.group]) {
      prev[cur.group] = cur.reduction;
    }
    return prev;
  }, {});
}

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

export function fillTime(arr, delimiter, date) {
  if (delimiter === 'DAYS' && isUndefined(date.month)) {
    console.error('Must give as third parameter when filling DAYS');
    return;
  }

  let objectified = objectifyRethinkReduction(arr);

  return Array.from({ length: getLength(delimiter, date) }, (val, i) =>
    objectified[i] ? objectified[i] : 0);
}

function getLength(delimiter, date) {
  if (delimiter === 'HOURS') {
    return 24;
  } else if (delimiter === 'DAYS') {
    return moment(getDateAsKey(date)).daysInMonth();
  } else if (delimiter === 'MONTHS') {
    return 12;
  }
}

// Turn this:
// {
//   2016-3-17: [
//     [3, 2, 0, 0, ...]
//   ]
// }
// into this:
// {
//   2016-3-17-1: { loading: false, val: 3 },
//   2016-3-17-2: { loading: false, val: 2 },
//   2016-3-17-3: { loading: false, val: 0 },
//   2016-3-17-4: { loading: false, val: 0 },
//   ...
// }
export function transmuteTime(dateKey, timeArray, loading) {
  let result = {};
  // console.log('DATEKEY: ', dateKey);
  timeArray.forEach((val, i) => {
    result[`${dateKey}-${i + 1}`] = loading ? { loading } : { val, loading };
  });
  return result;
}


