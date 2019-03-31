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


// TODO: write this with async await? - DONE
// export const createRequestThunk0 = ({ request, key, start = [], success = [], failure = [] }) => {
//   orange('key', key)
//   return (...args) => (dispatch) => {
//     const requestKey = (typeof key === 'function') ? key(...args) : key
//     start.forEach((actionCreator) => {
//       dispatch(actionCreator())
//     })
//     dispatch(requestPending(requestKey))
//     return request(...args)
//       .then((data) => {
//         success.forEach((actionCreator) => {
//           dispatch(actionCreator(data))
//         })
//         dispatch(requestSuccess(requestKey))
//       })
//       .catch((reason) => {
//         dispatch(requestFailed(reason, requestKey))
//         failure.forEach((actionCreator) => {
//           dispatch(actionCreator(reason))
//         })
//       })
//   }
// }


export const createRequestThunk = ({ request, key, start = [], success = [], failure = [] }) => {
  return (...args) => async (dispatch) => {
    const requestKey = (typeof key === 'function') ? key(...args) : key
    start.map(async (actionCreator) => {
      await dispatch(actionCreator())
    })
    await dispatch(requestPending(requestKey))
    try {
      const data = await request(...args)
      await dispatch(requestSuccess(requestKey))
      success.map(async (actionCreator) => {
        await dispatch(actionCreator(data))
      })
    }
    catch (e) {
      await dispatch(requestFailed(e, requestKey))
      failure.map(async (actionCreator) => {
        await dispatch(actionCreator(e))
      })
    }
  }
}