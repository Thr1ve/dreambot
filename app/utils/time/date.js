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

  getKey() {
    const { year, month, day, hour } = this.date;
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
