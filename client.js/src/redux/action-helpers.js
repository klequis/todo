// eslint-disable-next-line
import { orange, red } from '../logger'
import {
  requestPending,
  requestSuccess,
  requestFailed
} from './requests/actions'


export const logError = (err, key) => {

  red(`actions.logError(key:${key})`, err)
}
export const logReturnValue = (value) => {
  return ({
    type: 'app/noAction'
  })
}


// write this with async await?
export const createRequestThunk = ({ request, key, start = [], success = [], failure = [] }) => {
  return (...args) => (dispatch) => {
    const requestKey = (typeof key === 'function') ? key(...args) : key
    start.forEach((actionCreator) => {
      dispatch(actionCreator())
    })
    dispatch(requestPending(requestKey))
    return request(...args)
      .then((data) => {
        success.forEach((actionCreator) => {
          dispatch(actionCreator(data))
        })
        dispatch(requestSuccess(requestKey))
      })
      .catch((reason) => {
        dispatch(requestFailed(reason, requestKey))
        failure.forEach((actionCreator) => {
          dispatch(actionCreator(reason))
        })
      })
  }
}
