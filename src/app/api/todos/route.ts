import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../types'
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
});


//POST endpoint to create a new todo
export async function POST(req: NextRequest, res: NextResponse) {

    //try catch block to catch any errors
    try {
        if (req.method !== "POST") {
            //return the error with the status code 405
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }
        const { title }: Partial<Todo> = await req.json();

        if (!title) {
            //return the error with the status code 400
            return NextResponse.json({ Message: "Add a title" }, { status: 400 });
        } else {

            // Generate a new UUID for the todo ID
            const id: string = uuidv4();

            // Get the current timestamp
            const timestamp: number = Date.now();
    
            // Open a connection to the SQLite database
            const db = new sqlite3.Database(dbPath);

            //insert the new todo into the database
            const addSQL = `INSERT INTO todos (id, title, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;

            //Await the promise to resolve before closing the database connection
            await new Promise<void>((resolve, reject) => {

            db.run(addSQL, [id, title, 0, new Date(timestamp).toISOString(), new Date(timestamp).toISOString()], function(err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                    }
                     resolve();
                 });
                        
            });
                
             //construct the new todo object to return
             const newTodo: Todo = {
                id: id,
                title: title,
                completed: false,
                created_at: new Date(timestamp),
                updated_at: new Date(timestamp)
                };

                    console.log(newTodo)

                    //close the database connection after the query is run
                    db.close();

                    //return the new todo object
                    return NextResponse.json({todo: newTodo,
                        message: "Todo added successfully",
                        status: 200,
                        success: true
                    });

        }
    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: error,
            success: false });
    }
}

// GET endpoint to fetch all todos
export async function GET(req: NextRequest, res: NextResponse) {

    // Try catch block to catch any errors
    try {
        if (req.method !== "GET") {
            // Return the error with the status code 405
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }

        // Open a connection to the SQLite database
        const db = new sqlite3.Database(dbPath);

        // SQL query to fetch all todos from the database
        const fetchSQL = `SELECT * FROM todos`;

        // Await the promise to resolve before closing the database connection
        const todos: Todo[] = await new Promise<Todo[]>((resolve, reject) => {
            db.all(fetchSQL, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve(rows as Todo[]);
            });
        });

        // Close the database connection after the query is run
        db.close();

        // Return the todos array
        return NextResponse.json(todos, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: error,
            success: false
        });
    }
}

// DELETE endpoint to delete a todo by ID
export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        if (req.method !== "DELETE") {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }
        
        // Get the ID from the request body
        const { id }: Partial<Todo> = await req.json();

        // Return an error if the ID is not provided
        if (!id) {
            return NextResponse.json({ Message: "ID is required" }, { status: 400 });
        }

        // Open a connection to the SQLite database
        const db = new sqlite3.Database(dbPath);
        const deleteSQL = `DELETE FROM todos WHERE id = ?`;

        // Await the promise to resolve before closing the database connection
        await new Promise<void>((resolve, reject) => {
            db.run(deleteSQL, [id], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve();
            });
        });

        // Close the database connection after the query is run
        db.close();

        return NextResponse.json({ 
        message: "Todo deleted successfully", 
        status: 200, 
        success: true 
    });

    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: error,
            success: false
        });
    }
}

// UPDATE endpoint to update a todo by ID
export async function PUT(req: NextRequest, res: NextResponse) {

    // Try catch block to catch any errors
    try {

        // Return an error if the method is not PUT
        if (req.method !== "PUT") {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }

        // Get the ID from the request body
        const { id, title, completed }: Partial<Todo> = await req.json();

        // Return an error if the ID is not provided
        if (!id) {
            return NextResponse.json({ Message: "ID is required" }, { status: 400 });
        }

        // Open a connection to the SQLite database
        const db = new sqlite3.Database(dbPath);

        // SQL query to update the todo in the database
        const updateSQL = `UPDATE todos
                           SET title = COALESCE(?, title),
                               completed = COALESCE(?, completed),
                               updated_at = ?
                           WHERE id = ?`;

        const timestamp = new Date().toISOString();

        // Await the promise to resolve before closing the database connection
        await new Promise<void>((resolve, reject) => {
            db.run(updateSQL, [title, completed, timestamp, id], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve();
            });
        });

        // SQL query to fetch the updated todo from the database
        const fetchSQL = `SELECT * FROM todos WHERE id = ?`;

        // Await the promise to resolve before closing the database connection
        const updatedTodo: Todo = await new Promise<Todo>((resolve, reject) => {
            db.get(fetchSQL, [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve(row as Todo);
            });
        });

        // Close the database connection after the query is run
        db.close();

    return NextResponse.json(updatedTodo, { status: 200 });

    } catch (error) {

        return NextResponse.json({
            status: 400,
            message: error,
            success: false
        });
        
    }
}

    
