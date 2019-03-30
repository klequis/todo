import {
  TODO_ADD_KEY,
  TODOS_READ_KEY
} from './types'

export function todosReducer(
  state = [],
  action
) {
  switch (action.type) {
    case TODOS_READ_KEY:
      return action.payload
    case TODO_ADD_KEY:
      return {
        todos: [...state, action.payload]
      }
    default:
      return state
  }
}