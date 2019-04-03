import { Todo } from 'global-types'
// import { yellow } from 'logger'

type TodoState = {
  todos: Todo[]
}

export function getAllTodos(state: TodoState): Todo[] {
  return state.todos
}