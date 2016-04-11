
import moment from 'moment';

export function getDateAsKey({ year, month, day }) {
  return `${year}-${month}-${day}`;
}

export function fillHours(arr) {
  let objectified = arr.reduce((prev, cur) => {
    if (!prev[cur.group]) {
      prev[cur.group] = cur.reduction;
    }
    return prev;
  }, {});

  return Array.from({ length: 24 }, (val, i) =>
    objectified[i] ? objectified[i] : 0);
}
