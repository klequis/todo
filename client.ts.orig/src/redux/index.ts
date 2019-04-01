import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { todosReducer } from './todo/reducers'
import { requestsReducer } from './requests/reducers'

const rootReducer = combineReducers({
  todos: todosReducer,
  requests: requestsReducer
})

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore(){
  const middlewares = [thunkMiddleware]
  const middleWareEnhancer = applyMiddleware(...middlewares)
  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  )
  return store
}
