import {
  REQUEST_PENDING,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  RequestAction
} from 'global-types'

export const requestPending = (key: string): RequestAction => {
  return {
    type: REQUEST_PENDING,
    requestKey: key,
  }
}

export const requestSuccess = (key: string): RequestAction => {
  return ({
    type: REQUEST_SUCCESS,
    requestKey: key,
  })
}

export const requestFailed = (reason: Error, key: string): RequestAction => {
  return {
    type: REQUEST_FAILURE,
    payload: reason,
    requestKey: key,
  }
}