import { VISIBILITY_FILTERS } from "../../constants"

const getAllTodos = (state) => state.todos


// export const getTodosState = store => store.todos

export const getTodosByVisibilityFilter = (store, visibilityFilter) => {
  const allTodos = getAllTodos(store)
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.COMPLETED:
      return allTodos.filter(todo => todo.completed)
    case VISIBILITY_FILTERS.INCOMPLETE:
      return allTodos.filter(todo => !todo.completed)
    case VISIBILITY_FILTERS.ALL:
    default:
      return allTodos
  }
}
