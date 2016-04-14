
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
// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
export function getDelimiter({ year, month, day }) {
  if (isDefined(day)) {
    return 'HOURS';
  } else if (isDefined(month)) {
    return 'DAYS';
  } else if (isDefined(year)) {
    return 'MONTHS';
  }
}

// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
export function getDateAsKey({ year, month, day }) {
  if (isDefined(day)) {
    return `${year}-${month}-${day}`;
  } else if (isDefined(month)) {
    return `${year}-${month}`;
  } else if (isDefined(year)) {
    return `${year}`;
  }
}

// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
export function getDateFromKey(dateKey) {
  const split = dateKey.split('-');
  let newObj = {};

  if (split.length === 3) {
    newObj.day = parseInt(split[2], 10);
  }

  if (split.length >= 2) {
    newObj.month = parseInt(split[1], 10);
  }

  newObj.year = parseInt(split[0], 10);
  return newObj;
}

// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
function getDelimiterParent(delimiter) {
  switch (delimiter) {
    case 'HOURS':
      return 'DAYS';
    case 'DAYS':
      return 'MONTHS';
    case 'MONTHS':
      return 'YEARS';
    default:
      return console.error('INVALID DELIMITER: ', delimiter);
  }
}

// TODO: There has GOT to be a more concise way to handle date-keys and delimiters
const getDateFormat = delimiter => {
  switch (delimiter) {
    case 'HOURS':
      return 'YYYY-M-D';
    case 'DAYS':
      return 'YYYY-M';
    case 'MONTHS':
      return 'YYYY';
    default:
      return console.error('INVALID DELIMITER: ', delimiter);
  }
};

export function buildDatesArray({ start, end }, delimiter) {
  let results = [];
  const delimiterParent = getDelimiterParent(delimiter).toLowerCase();
  const dateFormat = getDateFormat(delimiter);

  const startDate = moment(getDateAsKey(start, dateFormat));
  const endDate = moment(getDateAsKey(end, dateFormat));
  const delimitedDistance = endDate.diff(startDate, delimiterParent) + 1;

  for (let i = 0; i < delimitedDistance; i++) {
    results.push(startDate.format(dateFormat));
    startDate.add(1, delimiterParent);
  }

  return results;
}

export function fillTime(arr, delimiter, date) {
  if (delimiter === 'DAYS' && isUndefined(date.month)) {
    console.error('Must give as third parameter when filling DAYS');
    return;
  }

  let objectified = objectify(arr);

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

