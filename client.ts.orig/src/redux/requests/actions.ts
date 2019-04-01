import {
  REQUEST_PENDING,
  REQUEST_SUCCESS,
  REQUEST_FAILURE
} from './types'

export const requestPending = (key: string) => {
  return {
    type: REQUEST_PENDING,
    requestKey: key,
  }
}


export const requestSuccess = (key: string) => {

  return ({
    type: REQUEST_SUCCESS,
    requestKey: key,
  })
}

export const requestFailed = (reason: any, key: string) => {
  return {
    type: REQUEST_FAILURE,
    payload: reason,
    requestKey: key,
  }
}