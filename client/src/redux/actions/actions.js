
// eslint-disable-next-line
import { orange, red } from '../../logger'

export const logError = (err, key) => {

  red(`actions.logError(key:${key})`, err)
}
export const logReturnValue = (value) => {
  return ({
    type: 'app/noAction'
  })
}

const markRequestPending = (key) => {
  return {
    type: 'app/markRequestPending',
    meta: { key },
  }
}

const markRequestSuccess = (key) => {
  return ({
    type: 'app/markRequestSuccess',
    meta: { key },
  })
}

const markRequestFailed = (reason, key) => {
  return {
    type: 'app/markRequestFailed',
    payload: reason,
    meta: { key },
  }
}

export const createRequestThunk = ({ request, key, start = [], success = [], failure = [] }) => {
  red('createRequestThunk: key', key)
  red('createRequestThunk: request', request)
  return (...args) => (dispatch) => {
    const requestKey = (typeof key === 'function') ? key(...args) : key
    start.forEach((actionCreator) => {
      dispatch(actionCreator())
    })
    dispatch(markRequestPending(requestKey))
    return request(...args)
      .then((data) => {
        success.forEach((actionCreator) => {
          dispatch(actionCreator(data))
        })
        dispatch(markRequestSuccess(requestKey))
      })
      .catch((reason) => {
        failure.forEach((actionCreator) => dispatch(actionCreator(reason)))
        dispatch(markRequestFailed(reason, requestKey))
      })
  }
}



//////////////////////////////////////////////////

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

export const TODO_READ_KEY = 'TODO_READ_KEY'
const todoRead = (todos) => {
  console.log('todos', todos);

  return ({
    type: TODO_READ_KEY,
    payload: {todos}
  })
}

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

// api
const todos = {
  async read(user) {
    try {
      const data = await fetchJson(
        '/api/todo',
        {
          method: 'GET',
        }
      )
      return data.data
    }
    catch (e) {
      const error = await e.error
      throw error
    }
  },
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

// export const createRequestThunk = ({ request, nextAction }) => {
//   return (...args) => (dispatch) => request(...args)
//   .then((data) => {
//     dispatch(nextAction(data))
//   })
//   .catch((reason) => {
//     console.log('ERROR')
//   })
// }

// const todoRequest = async () => {
//   try {
//     const data = await fetchJson(
//       '/api/todo',
//       {
//         method: 'GET',
//       }
//     )
//     const o = data.data
//     console.log('o', o)
//     return o
//   }
//   catch (e) {
//     const error = await e.error
//     throw error
//   }
// }

export const getTodos = createRequestThunk({
  request: todos.read,
  key: 'someKey',
  success: [ todoRead ]
})



// not using fetchJson
// export const getTodos2 = () => {
//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   }
//   return (dispatch) => fetch('/api/todo', {'headers': headers})
//     .then((res) => res.json())
//     // .then((data) => console.log('data', data.data))
//     .then((data) => dispatch(todoRead(data)))
//     .catch((reason) => {
//       console.log('getTodos failed', reason)
//     })
// }
