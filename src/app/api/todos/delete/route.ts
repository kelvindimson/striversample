import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../../types'
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';

//bring in database
const dbPath = path.resolve(process.cwd(), 'todo.db');

//check if the database exists
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the todo database.');
});// DELETE endpoint to delete a todo by ID


export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        if (req.method !== "DELETE") {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }

        const { id }: Partial<Todo> = await req.json();

        if (!id) {
            return NextResponse.json({ Message: "ID is required" }, { status: 400 });
        }

        const db = new sqlite3.Database(dbPath);
        const deleteSQL = `DELETE FROM todos WHERE id = ?`;

        await new Promise<void>((resolve, reject) => {
            db.run(deleteSQL, [id], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve();
            });
        });

        db.close();

        return NextResponse.json({ message: "Todo deleted successfully" });
        
    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: error,
            success: false
        });
    }
}