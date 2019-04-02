import { Todo } from 'global-types'
// import { yellow } from 'logger'
// export const getAllTodos = (state: any): Todo[] => state.todos

type TodoState = {
  todos: Todo[]
}

export function getAllTodos(state: TodoState): Todo[] {
  return state.todos
}