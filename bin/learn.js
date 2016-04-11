'use strict';
const r = require('rethinkdb');
const sentiment = require('sentiment');
let testMessages = require('../data/slackMessages.json');

const isQuestion = (message) => {
  const array = message.split(' ');
  const questionWords = ['who', 'what', 'where', 'how', 'when', 'why', 'does', 'can', 'is'];
  if (questionWords.indexOf(array[0]) !== -1) {
    return true;
  }
  if (array[array.length - 1][array[array.length - 1].length - 1] === '?') {
    return true;
  }

  return false;
};

const questions = testMessages
  .filter(message => {
    return isQuestion(message.text);
  })
  .map(question => ({question: question.text}));

console.log(questions);

// r.connect({ host: 'localhost', port: 28015 }).then(conn => {
//   r.db('test').table('messages').insert(testMessages)
//     .run(conn)
//     .then(() => conn.close()
//       .then(() => console.log('connection closed')))
//     .catch(err => console.error(err));
// });
