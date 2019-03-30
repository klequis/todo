import { applyMiddleware, compose, createStore } from "redux"
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import monitorReducerEnhancer from './monitorReducer'
import loggerMiddleware from './reduxLogger'
import { rootReducer } from './rootReducer'

export default function configureStore(){
  const middlewares = [/*loggerMiddleware,*/ thunkMiddleware]
  const middleWareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [/*monitorReducerEnhancer*/]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer, composedEnhancers)
  )

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./', () => store.replaceReducer(rootReducer))
  }

  return store
}
