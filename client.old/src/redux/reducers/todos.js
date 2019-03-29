import {
  ADD_TODO,
  TOGGLE_TODO,
  todosReadKey,
} from "../actions/actions"

import { append } from 'ramda'

const dummy = [
  {
    id: 0,
    title: 'hi'
  },
  {
    id: 1,
    title: 'by3'
  },
]

export default function(state = [], { type, payload}) {
  console.log('state', state)

  switch (type) {
    case todosReadKey:
      return append(payload.todos, state)
    default:
      return state
  }

}
