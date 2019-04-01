/* Dev */
// eslint-disable-next-line
// import { yellow } from 'logger'

const noStatus = {
  status: 'none',
  error: null,
}
export const getRequest = (state: any, key: string) => {
  const req = state.requests[key]
  return req === undefined
    ? noStatus
    : req
}

// ** Don't think this is used or eneded?
export const getRequestStatus = (state: any, key: string) => {
  if (state.requests.hasOwnProperty(key)) {
    return state.requests[key].status
  }
  return ''
}

export const getRequests = (state: any) => {

  return state.requests
}

export const areRequestsPending = (requests: any) => {
  return Object.keys(requests)
    .some((key) => requests[key].status === 'pending')
}
