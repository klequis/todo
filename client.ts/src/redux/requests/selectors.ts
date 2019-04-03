import { AppState } from 'global-types'
/* Dev */
// eslint-disable-next-line
import { yellow } from 'logger'

const noStatus = {
  status: 'none',
  error: null,
}
export const getRequest = (state: AppState, key: string) => {
  yellow('getRequest: state', state)
  if (state.requests[key] === null) {
    return noStatus
  } else {
    return state.requests[key]
  }
}

// ** Don't think this is used or eneded?
// export const getRequestStatus = (state: AppState, key: string) => {
//   if (state.requests.hasOwnProperty(key)) {
//     return state.requests[key].status
//   }
//   return ''
// }

// export const getRequests = (state: AppState) => {

//   return state.requests
// }

// export const areRequestsPending = (requests: any) => {
//   return Object.keys(requests)
//     .some((key) => requests[key].status === 'pending')
// }
