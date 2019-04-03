import {
  Todo,
  TODO_ADD_KEY,
  TODOS_READ_REQUEST_KEY,
  TODOS_READ_KEY,
  TODOS_ADD_REQUEST_KEY
} from './types'
import { createRequestThunk } from '../action-helpers'
import { ICreateRequestThunk } from '../action-helpers-types'
import api from '../../api'
// import { red } from '../../logger'
import { orange } from '../../logger'

export const todoAdd = (newTodo: Todo) => {
  orange('todoAdd: todo', newTodo);

  return {
    type: TODO_ADD_KEY,
    payload: newTodo,
  }
}

export const todosRead = (todos: Todo[]) => {
  return ({
    type: TODOS_READ_KEY,
    payload: todos,
  })
}

// Read
const todoReadRequestCall: ICreateRequestThunk = {
  request: api.todos.read,
  key: TODOS_READ_REQUEST_KEY,
  success: [todosRead],
  failure: [(error) => console.log('(7) todoReadRequestCall: request failed', error)]
}

export const todosReadRequest = createRequestThunk(todoReadRequestCall)
// export const todosReadRequest = [
//   {
//     _id: '123',
//     content: 'hello',
//     completed: false,
//   }
// ]


// Post
const todoAddRequestCall: ICreateRequestThunk = {
  request: api.todos.create,
  key: TODOS_ADD_REQUEST_KEY,
  success: [todoAdd],
  failure: [(error) => console.log('(7) todoAddRequestCall: request failed', error)]
}

export const todoAddRequest = createRequestThunk(todoAddRequestCall)