import {
  TODO_ADD_KEY,
  TODOS_READ_REQUEST_KEY,
  TODOS_READ_KEY,
  TODOS_ADD_REQUEST_KEY,
  TODOS_READ_BY_ID_REQUEST_KEY
} from './types'
import { createRequestThunk } from '../action-helpers'
import api from '../../api'
import { orange } from '../../logger'

// tmp

import {
  requestPending,
  requestSuccess,
  requestFailed
} from '../requests/actions'

//

export function todoAdd(newTodo) {
  orange('todoAdd: todo', newTodo);

  return {
    type: TODO_ADD_KEY,
    payload: newTodo,
  }
}

// Read
export const todosRead = (todos) => {
  return ({
    type: TODOS_READ_KEY,
    payload: todos,
  })
}

export const todosReadRequest = () => {
  return dispatch => {
    const key = TODOS_READ_REQUEST_KEY
    dispatch(requestPending(key))
    return api.todos.read()
      .then((data) => {
        dispatch(todosRead(data))
        dispatch(requestSuccess(key))
      })
      .catch((e) => {
        dispatch(requestFailed(e, key))
      })
  }
}

// export const todosReadRequest = createRequestThunk({
//   request: api.todos.read,
//   key: TODOS_READ_REQUEST_KEY,
//   success: [todosRead],
//   failure: [(error) => console.log('(7) todoReadRequestCall: request failed', error)]
// })



// Read by ID

// export function todoReadByIdRequest() {
//   return dispatch => {
//     const key = TODOS_READ_REQUEST_KEY
//     dispatch(requestPending(key))
//     return api.todos.readById()
//       .then((data) => {
//         dispatch(todosRead(data))
//         dispatch(requestSuccess(key))
//       })
//       .catch((e) => {
//         dispatch(requestFailed(e, key))
//       })
//   }
// }

// const todoReadByIdRequestCall = {
//   request: api.todos.readById,
//   key: TODOS_READ_BY_ID_REQUEST_KEY,
//   success: [todosRead],
//   failure: [(error) => console.log('todoReadByIdRequestCall: request failed', error)]
// }

// export const todosReadByIdRequest = createRequestThunk(todoReadByIdRequestCall)









// Post

export const todoAddRequest = createRequestThunk({
  request: api.todos.create,
  key: TODOS_ADD_REQUEST_KEY,
  success: [todoAdd],
  failure: [(error) => console.log('(7) todoAddRequestCall: request failed', error)]
})