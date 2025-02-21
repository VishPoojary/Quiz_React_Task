import Dexie from 'dexie';

const db = new Dexie('QuizAppDB');
db.version(1).stores({
  quizHistory: '++id, date, score, answers'
});

export default db;
