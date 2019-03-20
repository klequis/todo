let nextTodoId = 0

export const ADD_TODO = "ADD_TODO"
export const addTodo = content => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content
  }
})

export const TOGGLE_TODO = "TOGGLE_TODO"
export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  payload: { id }
})

export const SET_FILTER = "SET_FILTER"
export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } })
