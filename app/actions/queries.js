import moment from 'moment';

import { connection, r } from '../utils/rethink';
import { isValidDate, getDelimiter } from '../utils/time';

const byYear = (year) => r.row('ts').year().eq(year);
const byMonth = (month) => r.row('ts').month().eq(month);
const byDay = (day) => r.row('ts').day().eq(day);

const filters = {
  year: byYear,
  month: byMonth,
  day: byDay
};

const groups = {
  HOURS: 'hours',
  DAYS: 'day',
  MONTHS: 'month'
};

const assembleVolumesQuery = (date, delimiter) => {
  console.log(delimiter);
  // We grab each key from our date object, then add the
  // appropriate filter from `filters` and add it to the query
  return Object.keys(date).reduce((prev, cur) => prev.filter(filters[cur](date[cur])), r.table('messages'))
  // group them by our delimiter
  .group(r.row('ts')[groups[delimiter]]())
  .count();
}

export function getMessageVolumes(date) {
  let delimiter;

  if (!isValidDate(date)) {
    return Promise.reject('Incorrect date object passed to query');
  }

  delimiter = getDelimiter(date);

  return connection().then(conn =>
      assembleVolumesQuery(date, delimiter)
      .run(conn)
      .then(cursor => cursor.toArray())
    );
}

export function getMessages() {
  return connection()
    .then(conn =>
      r.table('messages')
        .run(conn)
        .then(cursor => cursor.toArray())
    );
}

export function getSearchResults(word) {
  return connection()
    .then(conn =>
      r.table('messages')
        .filter(message =>
          message('name').eq(word).or(message('tokens').contains(word))
        )
        .run(conn)
        .then(cursor => cursor.toArray())
    );
}

export function getAvgMessagesByHour({ year, month, day }) {
  return connection()
    .then(conn =>
      r.table('messages')
        .filter(
          r.row('ts').date().eq(r.time(year, month, day, 'Z'))
        )
        .group(r.row('ts').hours())
        .avg('score')
        .run(conn)
        .then(cursor => cursor.toArray())
    );
}

export function getAvgMessagesByDayOfWeek() {
  return connection()
    .then(conn =>
      r.table('messages')
        .group(r.row('ts').dayOfWeek())
        .avg('score')
        .run(conn)
        .then(cursor => cursor.toArray())
    );
}

export function getAllUniqueWords() {
  return connection()
    .then(conn =>
      r.table('messages')
      .getField('tokens')
      .concatMap(doc => doc)
      .run(conn)
      .then(cursor => cursor.toArray())
      )
}

export function queryWordCountByUser() {
  return connection()
    .then(conn =>
      r.table('messages')
      .limit(1000)
      .group('user')
      .getField('tokens')
      .concatMap(w => w)
      .count()
      .run(conn)
      .then(cursor => cursor.toArray())
      );
}

export function queryUserMessagesById() {
  return connection()
  .then(conn =>
  r.table('messages')
  .group('user')
  .count()
  .run(conn)
  .then(cursor => cursor.toArray())
  );
}

export function getClassifications() {
  return connection()
  .then(conn =>
    r.table('messages')
    .hasFields('classification')
    .group('classification')
    .count()
    .run(conn)
    .then(cursor => cursor.toArray())
  );
}

export function getUserMessageReduction() {
  return connection()
  .then(conn =>
    r.table('messages')
    .hasFields('name')
    .group('name')
    .count()
    .run(conn)
    .then(cursor => cursor.toArray())
  );
}

export function getSingleUserMessageReduction(userId) {
  return connection()
  .then(conn =>
    r.table('messages')
    .filter({ user: userId })
    .filter(
      r.row('ts').month().eq(moment().month() + 1)
    )
    .group(r.row('ts').day())
    .count()
    .run(conn)
    .then(cursor => cursor.toArray())
  );
}
