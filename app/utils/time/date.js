/* eslint-disable complexity */

import moment from 'moment';

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
    return { year };
  }

  getChildDate({ end } = { end: false }) {
    const { year, month, day, hour } = this.date;
    const n = end ? GlanceDate.getLength(this, getNextDelimiter(this.getDefaultDelimiter())) : 1;
    if (isDefined(hour)) {
      return { year, month, day, hour: n };
    } else if (isDefined(day)) {
      return { year, month, day, hour: n };
    } else if (isDefined(month)) {
      return { year, month, day: n };
    } else if (isDefined(year)) {
      return { year, month: n };
    }
  }

  getDefaultDelimiter({ parent } = { parent: false }) {
    const { year, month, day, hour } = parent ? this.getParentDate(this.date) : this.date;
    if (isDefined(hour)) {
      return 'HOURS';
    } else if (isDefined(day)) {
      return 'DAYS';
    } else if (isDefined(month)) {
      return 'MONTHS';
    } else if (isDefined(year)) {
      return 'YEARS';
    }
  }

  transmute(data, delimiter, loading) {
    const dateKey = this.getKey({ parent: true });
    let result = {};

    // Make an array that has 0's for each hour/day/month we don't have.
    const filled = Array.from({ length: GlanceDate.getLength(this, delimiter) }, (val, i) =>
      data[i + 1] ? data[i + 1] : 0);

    // then, Turn this:
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
    filled.forEach((val, i) => {
      result[`${dateKey}-${i + 1}`] = loading ? { loading } : { val, loading };
    });

    return result;
  }

  shed() {
    return new GlanceDate(this.getParentDate());
  }

  wrap({ end } = { end: false }) {
    return new GlanceDate(this.getChildDate({ end }));
  }

}

// returns the total possible number of hours/days/months/etc
// in said delimiter's parent
GlanceDate.getLength = function (glance, delimiter) {
  // the number of days in a month is variable, so
  // we need to assure we have the month# if our delimiter
  // is DAYS
  if (delimiter === 'DAYS' && isUndefined(glance.date.month)) {
    console.error('The glance must have a month when filling DAYS');
    return;
  }

  if (delimiter === 'HOURS') {
    return 24;
  } else if (delimiter === 'DAYS') {
    return moment(glance.getKey()).daysInMonth();
  } else if (delimiter === 'MONTHS') {
    return 12;
  }
};


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

function getDateFromKey(dateKey) {
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

function fillTime(obj, delimiter, date) {
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

// TODO: This is terrible...need to have a better way of dealing with this...
function getNext(str) {
  switch (str) {
    case 'HOURS':
      return 'hour';
    case 'DAYS':
      return 'hour';
    case 'MONTHS':
      return 'day';
    case 'YEARS':
      return 'month';
    default:
      return console.error('INVALID STRING FOR getNext');
  }
}

// TODO: This is terrible...need to have a better way of dealing with this...
function getNextDelimiter(str) {
  switch (str) {
    case 'HOURS':
      return 'HOURS';
    case 'DAYS':
      return 'HOURS';
    case 'MONTHS':
      return 'DAYS';
    case 'YEARS':
      return 'MONTHS';
    default:
      return console.error('INVALID STRING FOR getNext');
  }
}
