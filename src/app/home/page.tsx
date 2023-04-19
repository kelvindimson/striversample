// this is a client component
"use client"; 

import React, {useEffect, useState, useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { NextRouter, useRouter } from 'next/router';
import Modal from '../modal/Modal';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const Home = (props: Todo) => {

// const router: NextRouter = useRouter();
const [loading , setLoading] = useState(true)
const [todos, setTodos] = useState<Todo[]>([]);
const [empty, setEmpty] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);

const todoRef = useRef<HTMLInputElement>(null);


//Fetch todos from API
const fetchTodos = async () => {
  
  const response = await fetch('/api/todos');
  const todos = await response.json();

  //check if there is no todos
  if (todos.length <= 0) {
    setLoading(false);
    setEmpty('You have nothing to do today!')

  } else {
    setLoading(false);
    setTodos(todos);
    // router.replace(router.asPath);
  }

};

// Add Todo to the API
const addTodo = async (title: string) => {
  
  const response = await fetch('/api/todos', {
    method: 'POST',

    // Adding headers
    headers: {
      'Content-Type': 'application/json',
    },

    // Adding body or contents to send
    body: JSON.stringify({
      title,
    }),

  });

};

const clickAddTodo = async (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> ) => {
  
  event.preventDefault();

  const title = todoRef.current?.value;

  if(!title){
    console.log('no title');
  }else {

    await addTodo(title);

    //Clear empty state
    setEmpty('');

    fetchTodos();

    handleCloseModal();

    //clear input
    setTimeout(() => {
      if(todoRef.current) {
        todoRef.current.value = '';
      }
    }, 100)
    
  }

}

//Check if the event is a keyboard event
function isKeyboardEvent(event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): event is React.KeyboardEvent<HTMLInputElement> {
  return (event as React.KeyboardEvent<HTMLInputElement>).key !== undefined;
}


//Add todo on enter
const enterAddTodo = async (event: React.KeyboardEvent<HTMLInputElement> ) => {
  if (event.key === 'Enter') {
    await addTodo(event.currentTarget.value);

    //Clear empty state
    setEmpty('');

    handleCloseModal();

    fetchTodos();

    setTimeout(() => {

    if (event.currentTarget) {
        event.currentTarget.value = ' ';
    }

    }, 100)
  }
};

// Modal to add todo on same page
const handleOpenTodoModal = async () => {

  //make sure to open the modal first
    new Promise<void>((resolve, reject) => {
      setIsModalOpen(true);
      resolve();
    }).then(() => {

  //then focus on the input for good user experience
    setTimeout(() => {
      handleFocus();
      console.log('focus')
    }, 100)

    })
}


//open modal
const handleOpenModal = () => {
  setIsModalOpen(true);
  // console.log('open modal')
};

//close modal
const handleCloseModal = () => {
  setIsModalOpen(false);
  // console.log('close modal')
};



// const handleOpenTodoModal = () => {
//   setIsModalOpen(true);

//   if(todoRef.current) {
//     todoRef.current.focus();
//   }
  
// }



//focus on input
const handleFocus = () => {

  //check to make sure the input is not null
  if(todoRef.current) {
    todoRef.current.focus();
  }

}


useEffect(() => {

  fetchTodos();

}, []);





//delete todo
const deleteTodo = async (id: string) => {
  await fetch(`/api/todos`, {
    method: 'DELETE',

    // Adding body or contents to send
    body: JSON.stringify({
      id,
    }),
  });

  setTodos(todos.filter((todo) => todo.id !== id));

  //fetch todos again to update the UI in the background
  fetchTodos();

};




const [todosRef] = useAutoAnimate<HTMLElement>();

  return (
    <>
    <div className="bg-slate-100 w-full h-[100%] min-h-screen lg:px-10 px-4">
      <div className='mx-auto my-0 lg:w-3/6 md:w-4/5 sm:w-full p-6'>
        <div className="flex flex-col items-center">

          <div className='flex justify-between w-full items-center h-10 mb-10'>
            
            <div className='h-full flex items-center text-2xl font-semibold'>
              <h1 className="">Todos</h1>
            </div>

            <div>
              <button className="bg-blue-500 hover:bg-blue-500 text-white font-light py-2 px-4 rounded " onClick={handleOpenTodoModal}> 
                Add Todo 
              </button>
            </div>

          </div>


          <div className="w-full">
            {loading && <div className="text-center">Loading...</div>   }

            {empty && <div className="text-center">{empty}</div>   }
            <ul className="w-full" ref={todosRef}>
              {todos.map((todo) => (
             <li key={todo.id} className={` p-4 rounded-md mb-2 ${todo.completed ? 'bg-green-300' : 'bg-gray-300'}`}>

                <div className='grid grid-cols-6'>

                    <div className=' line-clamp-2 flex items-center col-span-4'> 
                    {todo.title} 
                    </div>

                    <div className='col-span-2 flex items-center justify-end bg-red-100'> 

                      <button className="mx-1 text-white p-4 bg-red-500 rounded" onClick={() => deleteTodo(todo.id)}>
                            Delete
                      </button>

                      <button className='bg-blue-500 p-4 rounded'>
                        Edit
                      </button>

                    </div>

                  </div> 

                </li>
              ))}
            </ul>
            
          </div>
            
        </div>




        

      </div>

    </div>
      <div className="bg-slate-900 h-24 w-full">
        {isModalOpen && (
          <div >

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} isClicked={handleCloseModal} title={"Add A New Todo"}>

          <input type="text" className='border-2 border-gray-300 text-gray-900 w-full h-12 px-2 rounded-md mb-4 focus:ring-0 focus:outline-none focus:border-2
           focus:border-purple-500' placeholder='Add Todo' ref={todoRef} onKeyDown={enterAddTodo} />

          <button className='bg-purple-500 hover:bg-purple-900 text-white font-light py-4 px-4 rounded-md w-full' onClick={clickAddTodo}>
            Add Todo 
          </button>

          {/* <button className='' onClick={handleFocus}> Focus </button> */}

          <button className='absolute top-2 right-2 grid place-items-center bg-slate-200 rounded-full h-8 w-8 text-sm hover:bg-slate-600 hover:text-white' onClick={handleCloseModal}> X </button>
          
        </Modal>

          </div>
        )}


        Footer
        
        
      </div>  
    </>
  )
}

export default Home