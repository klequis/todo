import { combineReducers } from "redux"
import { todosReducer } from './todo/reducers'
import { requestsReducer } from './requests/reducers'

export const rootReducer = combineReducers({
  todos: todosReducer,
  requests: requestsReducer
})