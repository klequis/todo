import {
  REQUEST_SUCCESS,
  REQUEST_PENDING,
  REQUEST_FAILURE
} from './types'

import { merge } from 'ramda'
import { blue } from '../../logger'

export function requestsReducer (
  state = {},
  action: any
  ): any {
  switch (action.type) {
    case REQUEST_PENDING:
      return merge(state, { [action.requestKey]: { status: 'pending', error: null } })
    case REQUEST_SUCCESS:
      return merge(state, { [action.requestKey]: { status: 'success', error: null } })
    case REQUEST_FAILURE:
      blue('requestsReducer.action', action)
      return merge(state, { [action.requestKey]: { status: 'failure', error: action.payload } })
    default:
      return state
  }
}


// { type, payload, meta }