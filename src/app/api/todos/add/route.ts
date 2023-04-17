import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../../types'

//Create Dummy Data URL
const DATA_SOURCE = "https://jsonplaceholder.typicode.com/todos";

//Dummy API Key to prevent unauthorized access
const API_KEY: string = process.env.DATA_API_KEY as string

    // Create async Post function to new Todo
    export async function POST(req:NextRequest, res: NextResponse) {

        //try catch block to catch any errors
        try{
            if (req.method !== "POST") {
                //return the error with the status code 405
                return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
            }

            const { userId, title }: Partial<Todo> = await req.json();
            //Keep the Error Specific for better user experience

            //check if there is title but no userID
            if (!userId && (title ?? '').length > 0) {
                return NextResponse.json({ error: "Missing ID" }, { status: 400 });
            }

            //check if there is userID but no title
            if (!title && (userId ?? 0) > 0) {
                return NextResponse.json({ error: "Missing Title" }, { status: 400 });
            }

            //check if there is no userID and no title
            if (!userId && !title) {
                return NextResponse.json({ error: "Missing ID and Title" }, { status: 400 });
            }
        
            const res = await fetch(DATA_SOURCE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'API_KEY': API_KEY,
                    //prevent CORS error
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    userId, title, completed: false
                })
            })

            const newTodo: Todo = await res.json();
        
            return NextResponse.json({ message: "Todo Created Successfully" }, { status: 200 });

        } catch(error){
            //return the error with the status code 500
            return NextResponse.json(error, { status: 500});
        }

    }