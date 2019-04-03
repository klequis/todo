import * as React from 'react'
import TodoItem from './TodoItem'
import { Todo } from 'global-types'

const TodoList = ({ todos }: { todos: Todo[]}) => {
  return (
    <div>
      <b>The List</b>
      <ul className="todo-list">
        {todos && todos.length
          ? todos.map((todo, index) => {
              return <TodoItem key={`todo-${todo._id}`} todo={todo} />
            })
          : "No todos, yay!"}
      </ul>
    </div>
  )
}
export default TodoList
