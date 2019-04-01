// eslint-disable-next-line
import { orange, red } from '../logger'
import { ICreateRequestThunk } from './action-helpers-types'
import {
  requestPending,
  requestSuccess,
  requestFailed
} from './requests/actions'


export const logError = (err: any, key: any) => {

  red(`actions.logError(key:${key})`, err)
}
export const logReturnValue = (value: any) => {
  return ({
    type: 'app/noAction'
  })
}



export const createRequestThunk = ({ request, key, start = [], success = [], failure = [] }: ICreateRequestThunk) => {
  orange('(1) createRequestThunk: key', <string>key)
  // red('createRequestThunk: request', request)
  return (...args: any) => (dispatch: any) => {
    const requestKey: string = (typeof key === 'function') ? key(...args) : key
    // console.log('args', args)
    // console.log('dispatch', dispatch)
    start.forEach((actionCreator) => {
      dispatch(actionCreator())
    })
    dispatch(requestPending(requestKey))
    return request(...args)
      .then((data: []) => {
        success.forEach((actionCreator) => {
          orange('actionCreator', actionCreator)
          dispatch(actionCreator(data))
        })
        dispatch(requestSuccess(requestKey))
      })
      .catch((reason: Error) => {
        orange('(6) createRequestThunk.catch: reason', reason)
        dispatch(requestFailed(reason, requestKey))
        failure.forEach((actionCreator) => {
          dispatch(actionCreator(reason))
        })
      })
  }
}
