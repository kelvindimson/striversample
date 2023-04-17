import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../types'
//import params

interface ParamsRequest extends NextRequest {
    params: {
      id: string;
    };
 }

//Create Dummy Data URL
const DATA_SOURCE = "https://jsonplaceholder.typicode.com/todos";

//Dummy API Key to prevent unauthorized access
const API_KEY: string = process.env.DATA_API_KEY as string

    // POST function to create new toDO
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
                return NextResponse.json({ error: "Missing usserID" }, { status: 400 });
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
        
            return NextResponse.json({ message: "Todo Created Succesfully" }, { status: 200 });

        } catch(error){
            //return the error with the status code 500
            return NextResponse.json(error, { status: 500});
        }

    }

    //GET function to fetch All toDos
    export async function GET(req:NextRequest, res: NextResponse) {

        //wrapped in try catch block to catch any errors
        try {
            if (req.method !== "GET") {
                    //return the error with the status code 405
                    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

                    } else {
                    //await for the response from the fetch function
                    const res = await fetch(DATA_SOURCE);
                        
                    const todo: Todo[] = await res.json();
                            
                    //return the response as JSON with the status code 200
                    return NextResponse.json(todo, { status: 200});

                 }

        } catch(error) {

            //return the error with the status code 500
            return NextResponse.json(error, { status: 500});

            }
    }

    // PUT function to update toDo by ID
    export async function PUT(req:NextRequest, res: NextResponse) {

        //try catch block to catch any errors
        try {
            if (req.method !== "PUT") {
                //return the error with the status code 405
                return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
            }

            const { userId, id, title, completed }: Todo = await req.json();

            //check if there is no userID and no title
            if (!userId || !title || !id || typeof(completed) !== 'boolean') {
                return NextResponse.json({ error: "Missing required data" }, { status: 400 });
            }
        
            const res = await fetch(`${DATA_SOURCE}/${id}`, {
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
        
            return NextResponse.json({ 
                todo: updatedTodo,
                message: `Todo ${id} Updated Successfully`,
                success: true,
                status: 200
                });

        } catch(error){
            //return the error with the status code 500
            return NextResponse.json({ 
                message: error,
                status: 400,
                success: false
            });
        }

    }

    // DELETE function to delete toDo by ID
    export async function DELETE(req:NextRequest, res: NextResponse) {

        //try catch block to catch any errors
        try{
            if (req.method !== "DELETE") {
                //return the error with the status code 405
                return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
            }

            const { id }: Partial<Todo> = await req.json();
            
            if (!id) {
                return NextResponse.json({ error: "Missing Todo Id" }, { status: 400 });
            }
        
            await fetch(`${DATA_SOURCE}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'API_KEY': API_KEY,
                    //prevent CORS error
                    "Access-Control-Allow-Origin": "*",
                },
            });
        
            return NextResponse.json({ message: `Todo ${id} deleted` }, { status: 200 });

            } catch(err) {

                //return the error with the status code 500
                return NextResponse.json(err, { status: 500});
            }



    }

