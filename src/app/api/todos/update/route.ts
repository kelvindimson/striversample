import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../../types'

//Create Dummy Data URL
const DATA_SOURCE = "https://jsonplaceholder.typicode.com/todos";

//Dummy API Key to prevent unauthorized access
const API_KEY: string = process.env.DATA_API_KEY as string

    // Create async PUT function to update data one todo by id
    export async function PUT(req:NextRequest, res: NextResponse) {

        //try catch block to catch any errors
        try{
            if (req.method !== "PUT") {
                //return the error with the status code 405
                return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
            }

            const { userId, id, title, completed}: Todo = await req.json();

            //Keep the Error Specific for better user experience

            //check if there is no userID and no title
            if (!userId || !title || !id || typeof(completed) !== 'boolean' ) { 
                return NextResponse.json({ error: "Missing required data" }, { status: 400 });
            }
        
            const res = await fetch(``, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'API_KEY': API_KEY,
                    //prevent CORS error
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    userId, title, completed
                })
            })

            const updatedTodo: Todo = await res.json();
        
            return NextResponse.json({ message: "Todo Created Successfully" }, { status: 200 });

        } catch(error){
            //return the error with the status code 500
            return NextResponse.json(error, { status: 500});
        }

    }