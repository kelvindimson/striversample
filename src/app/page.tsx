// this is a client component
"use client"; 

import React, {useEffect, useState, useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { NextRouter, useRouter } from 'next/router';
import Modal from './modal/Modal';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

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
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

const todoRef = useRef<HTMLInputElement>(null);
const editRef = useRef<HTMLInputElement>(null);



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

    const updatedTodos = async () => {
  
      const response = await fetch('/api/todos');
      const newtodos = await response.json();
      setTodos(newtodos);

    }

    updatedTodos();

    handleCloseModal();

    //clear input
    setTimeout(() => {
      toast.success('Todo added!');

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

    const updatedTodos = async () => {
  
      const response = await fetch('/api/todos');
      const newtodos = await response.json();
      setTodos(newtodos);

    }

    updatedTodos();


    setTimeout(() => {
      toast.success('Todo added!');
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

//open edit modal
const OpenEditModal = () => {
  setIsEditModalOpen(true);
  // console.log('open edit modal')
};

const CloseEditModal = () => {
  setIsEditModalOpen(false);
  // console.log('close edit modal')
};

//closeedit modal on esc
const handleEditModalClose = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.key === 'Escape') {
    CloseEditModal();
}};




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

  toast.success('Todo Deleted!');

};

//edit todo
const editTodo = async (id: string, title: string) => {

  await fetch(`/api/todos`, {
    method: 'PUT',
    // Adding headers
    headers: {
      'Content-Type': 'application/json',
    },
    // Adding body or contents to send
    body: JSON.stringify({
      id,
      title,
    }),

  });
};

//Open modal to edit todo
const handleOpenEditModal = async (id: string, title: string) => {

  //make sure to open the modal first
    new Promise<void>((resolve, reject) => {
      setIsEditModalOpen(true);
      resolve();
    }).then(() => {

      //display the todo ID in a separate element
      if (editRef.current) {
        editRef.current.innerText = `${id}`;
      }

      //show the todo title in the input
      if (todoRef.current) {
        todoRef.current.value = `${title}`;
      }

  //then focus on the input for good user experience
    setTimeout(() => {
      handleFocus();
      console.log('focus')
      
    }, 100)

    })

}

//Handle edit todo
const handleEditTodo = async (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> ) => {

      //new title for the todo
      const newTitle = todoRef.current?.value;
      const todoId = editRef.current?.innerText;

      console.log(newTitle, todoId)

      editTodo(todoId!, newTitle!);

      // //fetch todos again to update the UI in the background
      // fetchTodos();

      //set state of todos and update the UI
      setTodos((prevTodos) => prevTodos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            title: newTitle,
          };
        }
        return todo;
      }).filter((todo) => todo.title !== undefined) as Todo[]);


      




      

      //close modal
      CloseEditModal();

      //clear input
      setTimeout(() => {
        toast.success('Todo edited!');

        if(todoRef.current) {
          todoRef.current.value = '';
        }
      }
      , 100)

}

//Toogle todo
const toggleTodo = async (id: string, completed: boolean) => {
  await fetch(`/api/todos`, {
    method: 'PUT',
    // Adding headers
    headers: {
      'Content-Type': 'application/json',
    },
    // Adding body or contents to send
    body: JSON.stringify({
      id,
      completed: !completed,
    }),
  });
};

const handleToggleTodo = async (id: string, completed: boolean) => {

  toggleTodo(id, completed);

  //set state of todos and update the UI
  setTodos(todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !completed,
      };
    }
    return todo;
  }));


  setTimeout(() => {
    toast.success('Todo updated!');
  }, 100)


}








const [todosRef] = useAutoAnimate<HTMLElement>();

  return (
    <>
   <Toaster />
    <div className="bg-slate-100 w-full h-[100%] min-h-screen lg:px-10 px-4">
      <div className='mx-auto my-0 lg:w-3/6 md:w-4/5 sm:w-full py-10'>
        <div className="flex flex-col items-center">

          <div className='flex justify-between w-full items-center h-10 mb-10'>
            
            <div className='h-full flex items-center text-2xl font-semibold'>
              <h1 className="">Striver</h1>
            </div>

            <div>
              <button className="bg-purple-500 hover:bg-purple-900 text-white font-light py-4 px-6 rounded " onClick={handleOpenTodoModal}> 
                Add Todo 
              </button>
            </div>

          </div>


          <div className="w-full">
            {loading && <div className="text-center">Loading...</div>   }

            {empty && <div className="text-center">{empty}</div>   }
            <ul className="w-full" ref={todosRef}>

              {/* //slice to reverse the array to show new todo at the top  */}
            {todos.slice().reverse().map((todo) => (
             <li key={todo.id} className={`p-4 rounded-md mb-2 ${todo.completed ? 'bg-green-300' : 'bg-gray-300'}`}>

                <div className='grid grid-cols-8 gap-1'>


                  <div className='flex col-span-6 gap-2'>

                      <div className='col-span-1 flex items-center justify-center'>

                        {todo.completed ? 
                        <div> 

                        <div className='bg-green-600 flex p-2 items-center justify-center h-7 w-7 rounded-full' onClick={() => handleToggleTodo(todo.id, todo.completed)} role='button' title="Mark Uncompleted">
                        <Image src='/icons/check.svg' alt='delete' width={20} height={20} /> 
                        </div>

                        </div> : 
                        
                        
                        <div> 
                         <div className='bg-blue-50 flex items-center justify-center h-6 w-6 rounded-full' onClick={() => handleToggleTodo(todo.id, todo.completed)} role='button' title="Mark Completed">
                        
                        </div>
                          
                        </div>}

                        
                      </div>

                      <div className='w-full flex items-center break-all'>
                      {todo.title} 
                      </div>

                  </div>

                  <div className=' col-span-2 flex justify-end items-center'>

                      <button className="mx-1 text-white p-2 bg-red-300 hover:bg-red-400 rounded-full flex items-center" onClick={() => deleteTodo(todo.id)} title="Delete todo?" >
                        <Image src='/icons/trash.svg' alt='delete' width={20} height={20} />
                      </button>

                      <button className="mx-1 text-white p-2 bg-teal-400 hover:bg-teal-500 rounded-full flex items-center" onClick={() => handleOpenEditModal(todo.id, todo.title)} title="Edit todo?">
                        <Image src='/icons/pencil.svg' alt='delete' width={20} height={20} />
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

        {isEditModalOpen && (
          <div >

            <Modal isOpen={isEditModalOpen} onClose={handleCloseModal} isClicked={CloseEditModal} title={"Edit Todo"} >

              <div ref={editRef} hidden> 

              </div>

              <input type="text" className='border-2 border-gray-300 text-gray-900 w-full h-12 px-2 rounded-md mb-4 focus:ring-0 focus:outline-none focus:border-2
              focus:border-purple-500' placeholder='Add Todo' ref={todoRef}/>


              <button className='bg-purple-500 hover:bg-purple-900 text-white font-light py-4 px-4 rounded-md w-full' onClick={handleEditTodo}>
               Edit Todo
              </button>

              <button className='absolute top-2 right-2 grid place-items-center bg-slate-200 rounded-full h-8 w-8 text-sm hover:bg-slate-600 hover:text-white' onClick={CloseEditModal}> X </button>
              
            </Modal>

          </div>
        )}


        Footer
        
        
      </div>  
    </>
  )
}

export default Home