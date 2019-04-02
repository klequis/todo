import {
  TODO_ADD_KEY,
  TODOS_READ_REQUEST_KEY,
  TODOS_READ_KEY,
  TODOS_ADD_REQUEST_KEY,
  TODOS_READ_BY_ID_REQUEST_KEY
} from './constants'
import { createRequestThunk } from '../action-helpers'
import api from '../../api'
import { orange, red } from '../../logger'

// tmp

// import {
//   requestPending,
//   requestSuccess,
//   requestFailed
// } from 'redux/requests/actions'

import { Todo, Action } from '../../global-types'

//


export const todoAdd = (newTodo: Todo): Action => {
  orange('todoAdd: todo', newTodo);

  return {
    type: TODO_ADD_KEY,
    payload: newTodo,
  }
}

// Read
export const todosRead = (todos: Todo[]): Action => {
  return ({
    type: TODOS_READ_KEY,
    payload: todos,
  })
}

// export const todosReadRequest0 = () => {
//   return (dispatch: Dispatch) => {
//     const key = TODOS_READ_REQUEST_KEY
//     dispatch(requestPending(key))
//     return api.todos.read()
//       .then((data) => {
//         dispatch(todosRead(data))
//         dispatch(requestSuccess(key))
//       })
//       .catch((e) => {
//         dispatch(requestFailed(e, key))
//       })
//   }
// }


// works well
// export const todosReadRequest = () => {
//   return async dispatch => {
//     const key = TODOS_READ_REQUEST_KEY
//     await dispatch(requestPending(key))
//     try {
//       const data = await api.todos.read()
//       dispatch(requestSuccess(key))
//       dispatch(todosRead(data))
//     }
//     catch (e) {
//       dispatch(requestFailed(e, key))
//     }
//   }
// }

// export const todosReadRequest = createRequestThunk({
//   request: api.todos.read,
//   key: TODOS_READ_REQUEST_KEY,
//   success: [todosRead],
//   failure: [(error) => console.log('(7) todoReadRequest: request failed', error)]
// })

export const todosReadRequest = createRequestThunk({
  request: api.todos.read,
  key: TODOS_READ_REQUEST_KEY,
  success: [todosRead],
  failure: [(error: Error) => console.log('(7) todoReadRequest: request failed', error)]
})

export const todosReadByIdRequest = createRequestThunk({
  request: api.todos.readById,
  key: TODOS_READ_BY_ID_REQUEST_KEY,
  success: [todosRead],
  failure: [(error: Error) => red('(7) todoReadByIdRequest: request failed', error)]
})

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

// Post

export const todoAddRequest = createRequestThunk({
  request: api.todos.create,
  key: TODOS_ADD_REQUEST_KEY,
  success: [todoAdd],
  failure: [(error: Error) => console.log('(7) todoAddRequestCall: request failed', error)]
})