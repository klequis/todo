import * as React from 'react'
// import { TodosState } from '../../redux/todo/types'
import { Todo } from '../../redux/todo/types'
import TodoItem from './TodoItem'

interface Props {
  todos: Todo[]
}

const TodoList = ({ todos }: Props) => {
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
