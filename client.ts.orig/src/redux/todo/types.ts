// Todo Type
export interface Todo {
  _id: string,
  content: string,
  completed?: boolean,
}

export interface TodosState {
  todos: Todo[]
}

// Read

export const TODOS_READ_KEY = 'TODOS_READ_KEY'
export const TODOS_READ_REQUEST_KEY = 'TODOS_READ_REQUEST_KEY'
interface TodosReadAction {
  type: typeof TODOS_READ_KEY
  payload: TodosState
}



// Add
export const TODO_ADD_KEY = 'TODO_ADD_KEY'
export const TODOS_ADD_REQUEST_KEY = 'TODOS_ADD_REQUEST_KEY'

interface AddTodoAction {
  type: typeof TODO_ADD_KEY
  payload: Todo
}




export type TodoActionTypes =  AddTodoAction | TodosReadAction
