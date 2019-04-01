import {
  TODO_ADD_KEY,
  TODOS_READ_KEY
} from './types'

// import { blue } from 'logger'

export function todosReducer(
  state = [],
  action
) {
  switch (action.type) {
    case TODOS_READ_KEY:
      return action.payload
    case TODO_ADD_KEY:
      return [...state, action.payload[0]]
    default:
      return state
  }
}