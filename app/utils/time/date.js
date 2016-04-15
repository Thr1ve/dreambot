/* eslint-disable complexity */

import {
  isUndefined,
  areUndefined,
  isDefined,
  areDefined,
} from '../checks';

export class GlanceDate {
  constructor(dateObj) {
    const date = handleDateKeyStrings(dateObj);
    if (!isValidDate(date)) {
      throw new Error('Invalid date object');
    }
    this.date = date;
  }

  getKey({ parent } = { parent: false }) {
    const { year, month, day, hour } = parent ? this.getParentDate(this.date) : this.date;
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

  getParentDate() {
    const { year, month, day, hour } = this.date;
    if (isDefined(hour)) {
      return { year, month, day };
    } else if (isDefined(day)) {
      return { year, month };
    } else if (isDefined(month)) {
      return { year };
    }
  }

  getDefaultDelimiter() {
    const { year, month, day, hour } = this.date;
    if (isDefined(hour)) {
      return 'HOURS';
    } else if (isDefined(day)) {
      return 'DAYS';
    } else if (isDefined(month)) {
      return 'MONTHS';
    }
  }

  transmute(data, delimiter, loading) {
    return transmuteTime(
      this.getKey({ parent: true }),
      fillTime(data, delimiter, this.date),
      loading
    );
  }

}

GlanceDate.getDateFormat = function (delimiter) {
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

// let d = new GlanceDate({ year: 2016, month: 3, day: 4, hour: 17 });
// console.log(d);
// console.log(d.getKey());
// console.log(d.getKey({ parent: true }));
// console.log(d.getParentDate());
// console.log(d.getDefaultDelimiter());

// let d = new GlanceDate('2016-3-17-5');
// console.log(d);

// A valid date object will have one of the following:
//   a. An hour, day, month, and year
//   b. A day, month, and year
//   c. A month and year
//   d. A year
export function isValidDate({ year, month, day, hour }) {
  // does it have a year, month, day, and hour?
  if (areDefined(year, month, day, hour)) {
    return true;
  // does it have a year, month, and day, but no hour?
  } else if (areDefined(year, month, day) && isUndefined(hour)) {
    return true;
  // does it have a month and year, but no day or hour?
  } else if (areDefined(year, month) && areUndefined(day, hour)) {
    return true;
  // does it have only a year?
  } else if (isDefined(year) && areUndefined(month, day, hour)) {
    return true;
  }
  return false;
}

function handleDateKeyStrings(dateObj) {
  if (typeof dateObj === 'string') {
    return getDateFromKey(dateObj);
  }
  return dateObj;
}

export function getDateFromKey(dateKey) {
  const split = dateKey.split('-');
  let newObj = {};

  if (split.length === 4) {
    newObj.hour = parseInt(split[3], 10);
  }

  if (split.length >= 3) {
    newObj.day = parseInt(split[2], 10);
  }

  if (split.length >= 2) {
    newObj.month = parseInt(split[1], 10);
  }

  newObj.year = parseInt(split[0], 10);
  return newObj;
}

export function fillTime(obj, delimiter, date) {
  // the number of days in a month is variable, so
  // we need to assure we have the month# if our delimiter
  // is DAYS
  if (delimiter === 'DAYS' && isUndefined(date.month)) {
    console.error('Must give as third parameter when filling DAYS');
    return;
  }

  // Make an array that has 0's for each hour/day/month we don't have.
  return Array.from({ length: getLength(delimiter, date) }, (val, i) =>
    obj[i] ? obj[i] : 0);
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
