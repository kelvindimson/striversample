const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./todos.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the todos database.');
});

const createTable = `CREATE TABLE todos(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT false)`;

db.run(createTable, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created todos table.');
})
