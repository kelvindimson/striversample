"use client"; // this is a client component

import React, {useEffect, useState} from 'react'

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const Page = (props: Todo) => {
// eslint-disable-next-line react-hooks/rules-of-hooks
const [loading , setLoading] = useState(true)
const [todos, setTodos] = useState<Todo[]>([]);

useEffect(() => {
  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    setTodos(todos);
  };

  fetchTodos();
}, []);

  return (
    <div className="bg-slate-100 w-full h-screen px-10 ">
      <div className='mx-auto my-0 lg:w-3/6 md:w-4/5 sm:w-full p-6'>
        <div className="flex flex-col items-center">

          <div className='flex justify-between w-full items-center h-10 mb-10'>
            <div className='h-full flex items-center text-2xl font-semibold'>
              <h1 className="">Todos</h1>
            </div>

            <div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-light py-2 px-4 rounded" > Add Todo </button>
            </div>
          </div>


          <div className="w-full">

            <ul className="w-full">
            {todos.map((todo) => (
              <li key={todo.id} className={`p-4 rounded-md mb-2 ${todo.completed ? 'bg-green-300' : 'bg-gray-300'}`}>
                <span>{todo.title}</span>
              </li>
            ))}
          </ul>
            
          </div>
            
        </div>

      </div>

    </div>
  )
}

export default Page