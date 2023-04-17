import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./todos.db', sqlite3.OPEN_READWRITE, (err: Error | null) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the todos database.');
});

export default db;