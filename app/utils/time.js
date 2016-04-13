
import moment from 'moment';

const isUndefined = e => e === undefined;
const areUndefined = (...args) => args.every(e => isUndefined(e));
const isDefined = e => !isUndefined(e);
const areDefined = (...args) => args.every(e => isDefined(e));

export function objectify(arr) {
  return arr.reduce((prev, cur) => {
    if (!prev[cur.group]) {
      prev[cur.group] = cur.reduction;
    }
    return prev;
  }, {});
}

// A valid date object will have one of the following:
//   a. A day, month, and year
//   b. A month and year
//   c. A year
export function isValidDate({ year, month, day }) {
  // does it have a year, month, and day?
  if (areDefined(year, month, day)) {
    return true;
  // does it have a month and year, but no day?
  } else if (areDefined(year, month) && isUndefined(day)) {
    return true;
  // does it have only a year?
  } else if (isDefined(year) && areUndefined(month, day)) {
    return true;
  }
  return false;
}

// Uses the date object to get the appropriate delimiter to group by
// assumes valid date object
export function getDelimiter({ year, month, day }) {
  if (isDefined(day)) {
    return 'HOURS';
  } else if (isDefined(month)) {
    return 'DAYS';
  } else if (isDefined(year)) {
    return 'MONTHS';
  }
}

export function getDateAsKey({ year, month, day }) {
  return `${year}-${month}-${day}`;
}

export function fillTime(arr, delimiter, month) {
  if (delimiter === 'DAYS' && isUndefined(month)) {
    console.error('Must give month as third parameter when filling DAYS');
    return;
  }

  let objectified = objectify(arr);

  // TODO: handle filling different delimiters
  return Array.from({ length: 24 }, (val, i) =>
    objectified[i] ? objectified[i] : 0);
}
