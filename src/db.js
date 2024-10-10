import { DatabaseSync } from 'node:sqlite'
import SqlBricks from 'sql-bricks';

const database = new DatabaseSync('./db.sqlite');

function runSeed(items) {
    database.exec(`
        DROP TABLE IF EXISTS students
    `);
    database.exec(`
        CREATE TABLE students(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        ) STRICT
    `);

    insert({ table: 'students', items });
}

export function select(query) {
    return database.prepare(query).all();
}

export function insert({ table, items }) {
    const { text, values } = SqlBricks.insertInto(table, items)
        .toParams({ placeholder: '?' });
    const insertStatment = database.prepare(text);
    insertStatment.run(...values);
}

runSeed([
    {
        name: 'Alê',
        phone: '123456789'
    },
    {
        name: 'Eric',
        phone: '12345678910'
    },
    {
        name: 'Mariana',
        phone: '1234567891012345'
    }
])
