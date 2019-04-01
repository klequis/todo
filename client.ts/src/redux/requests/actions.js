import {
  REQUEST_PENDING,
  REQUEST_SUCCESS,
  REQUEST_FAILURE
} from './types'

export const requestPending = (key) => {
  return {
    type: REQUEST_PENDING,
    requestKey: key,
  }
}

export const requestSuccess = (key) => {
  return ({
    type: REQUEST_SUCCESS,
    requestKey: key,
  })
}

export const requestFailed = (reason, key) => {
  return {
    type: REQUEST_FAILURE,
    payload: reason,
    requestKey: key,
  }
}