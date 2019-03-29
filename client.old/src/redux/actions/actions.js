import api from '../../api'
import { createRequestThunk } from './action-helpers'

import { red } from '../../logger'

let nextTodoId = 0;

export const ADD_TODO = "ADD_TODO";
export const addTodo = content => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content
  }
});

export const TOGGLE_TODO = "TOGGLE_TODO";
export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  payload: { id }
});

export const SET_FILTER = "SET_FILTER";
export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });

// Read
export const todosReadKey = 'todosReadKey'
export const todosReadRequestKey = 'todosReadRequestKey'

export const todosRead = (todos) => {
  console.log('todos', todos);

  return ({
    type: todosReadKey,
    payload: { todos },
  })
}

export const todosReadRequest = createRequestThunk({
  request: api.todos.read,
  key: todosReadRequestKey,
  success: [todosRead],
  failure: [(error) => red('request failed', error)]
})

