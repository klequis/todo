export type Todo = {
  _id: string,
  title: string,
  completed?: boolean,
}

export type Action = {
  type: string,
  payload: any
}

export const REQUEST_PENDING = 'REQUEST_PENDING'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'
export type RequestAction = {
  type: typeof REQUEST_SUCCESS | typeof REQUEST_PENDING | typeof REQUEST_FAILURE
  requestKey: string
  status?: typeof REQUEST_SUCCESS | typeof REQUEST_PENDING | typeof REQUEST_FAILURE
  error?: Error | null
  payload?: any
}