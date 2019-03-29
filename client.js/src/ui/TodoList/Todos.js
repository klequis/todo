import * as React from 'react'
import Todo from './Todo'

const TodoList = ({ todos }) => {
  return (
    <div>
      <b>The List</b>
      <ul className="todo-list">
        {todos && todos.length
          ? todos.map((todo, index) => {
              return <Todo key={`todo-${todo._id}`} todo={todo} />
            })
          : "No todos, yay!"}
      </ul>
    </div>
  )
}
export default TodoList
