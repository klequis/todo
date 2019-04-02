import {
  REQUEST_SUCCESS,
  REQUEST_PENDING,
  REQUEST_FAILURE,
  RequestAction
} from 'global-types'
import { merge } from 'ramda'

export function requestsReducer (
  state = null,
  action: RequestAction
  ) {
  switch (action.type) {
    case REQUEST_PENDING:
      return merge(state, { [action.requestKey]: { status: REQUEST_PENDING, error: null } })
    case REQUEST_SUCCESS:
      return merge(state, { [action.requestKey]: { status: REQUEST_SUCCESS, error: null } })
    case REQUEST_FAILURE:
      return merge(state, { [action.requestKey]: { status: REQUEST_FAILURE, error: action.payload } })
    default:
      return state
  }
}