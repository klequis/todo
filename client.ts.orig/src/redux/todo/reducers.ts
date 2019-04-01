import {
  TodosState,
  TODO_ADD_KEY,
  TodoActionTypes,
  TODOS_READ_KEY
} from './types'

const initialState: TodosState = {
  todos: []
}

export function todosReducer(
  state: TodosState = initialState,
  action: TodoActionTypes
): TodosState {

  switch (action.type) {
    case TODOS_READ_KEY:
      return action.payload
    case TODO_ADD_KEY:
    return {
      todos: [...state.todos, action.payload]
    }
    default:
      return state
  }
}