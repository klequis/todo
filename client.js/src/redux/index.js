import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import thunkMiddleware from 'redux-thunk'

import monitorReducerEnhancer from './monitorReducer'
import loggerMiddleware from './reduxLogger'

import { todosReducer } from './todo/reducers'
import { requestsReducer } from './requests/reducers'

import { composeWithDevTools } from 'redux-devtools-extension'

const rootReducer = combineReducers({
  todos: todosReducer,
  requests: requestsReducer
})

export default function configureStore(){
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middleWareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [monitorReducerEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer, composedEnhancers)
  )
  return store
}
