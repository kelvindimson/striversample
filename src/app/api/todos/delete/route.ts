import { NextRequest, NextResponse } from "next/server";
import { Todo } from '../../../../../types'

//Create Dummy Data URL
const DATA_SOURCE = "https://jsonplaceholder.typicode.com/todos";

//Dummy API Key to prevent unauthorized access
const API_KEY: string = process.env.DATA_API_KEY as string

// Create async DELETE function to delete data from the dummy data URL
export async function DELETE(req:NextRequest, res: NextResponse) {

    //try catch block to catch any errors
    try{
        if (req.method !== "DELETE") {
            //return the error with the status code 405
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }

        const { id }: Partial<Todo> =await req.json();
        
        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
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

    } catch(error){

        //return the error with the status code 500
        return NextResponse.json(error, { status: 500});

    }

}

