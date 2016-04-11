'use strict';
const r = require('rethinkdb');
const axios = require('axios');

const token = '';

const connect = () =>
  r.connect({
    host: 'localhost',
    port: 28015,
    db: 'test'
  });

const runQuery = query => connect().then(conn => query.run(conn));

const getMessages = r.table('messages').filter(
  r.row.hasFields('plkj').not()
);

const updateUser = (id, newUser) => r.table('messages').get(id).update(newUser);

runQuery(getMessages).then(cursor => cursor.each(function (err, message) {
  if (err) {
    console.log('error: ', err);
  }
  axios.get(`https://slack.com/api/users.info?token=${token}&user=${message.user}`)
    .then((res) => {
      // console.log(res.data.user);
      // Object.assign(message, { profile: res.data.user.profile });
      Object.assign(message, { plkj: res.data.user.profile });
      runQuery(updateUser(message.id, message));
    });
}));
