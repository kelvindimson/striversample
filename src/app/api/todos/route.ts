import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../types'

//Create Dummy Data URL
const DATA_SOURCE = "https://jsonplaceholder.typicode.com/todos";

//Create async GET function to fetch data from the dummy data URL

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