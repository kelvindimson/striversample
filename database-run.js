const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./todo.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the todos database.');
});

const createTable = `CREATE TABLE todos(id TEXT PRIMARY KEY, 
    title TEXT, 
    completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`;

db.run(createTable, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created New Todo table.');
})
