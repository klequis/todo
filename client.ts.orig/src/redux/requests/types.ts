

export const REQUEST_PENDING = 'REQUEST_PENDING'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'


interface IRequestPendingAction {
  type: typeof REQUEST_PENDING
  requestKey: string
}

interface IRequestSuccessAction {
  type: typeof REQUEST_SUCCESS
  requestKey: string
}

interface IRequestFailureAction {
  type: typeof REQUEST_FAILURE
  requestKey: string
  payload: any
}

export type RequestActionTypes = IRequestPendingAction | IRequestSuccessAction | IRequestFailureAction