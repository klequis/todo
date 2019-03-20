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

///////////////////////////////

const rejectErrors = (res) => {
  const { status } = res

  if (status >= 200 && status < 300) {
    return res
  }

  return Promise.reject({
    statusText: res.statusText,
    status: res.status,
    error: res.json()
  })
}

export const TODO_READ_KEY = 'TODO_READ_KEY'
export const todoRead = (todos) => {
  console.log('todos', todos);

  return ({
    type: TODO_READ_KEY,
    payload: {todos}
  })
}




export const fetchJson = (url, options = {}) => {
  let headers = {
    ...options.headers,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  return (
    fetch(url, {
      ...options,
      headers,
    }).then(rejectErrors)
      .then((res) => res.json())
  )
}

// using fetchJson
// export const getTodos = () => {
//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   }
//   return (dispatch) => fetchJson('/api/todo')
//     .then((data) => { console.log(data) })
//     .catch((reason) => {
//       console.log('getTodos failed', reason)

//     })

// }

// not using fetchJson
export const getTodos = () => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  return (dispatch) => fetch('/api/todo', {'headers': headers})
    .then((res) => res.json())
    // .then((data) => console.log('data', data.data))
    .then((data) => dispatch(todoRead(data)))
    .catch((reason) => {
      console.log('getTodos failed', reason)

    })

}

// dispatch(todoRead(data))

// todos => dispatch(todoRead(todos))