import * as React from 'react'
import cx from 'classnames'
import { Todo } from 'global-types'

const TodoItem = ({ todo }: { todo: Todo }) => {
  return (
    <li className='todo-item'>
      {todo && todo.completed ? '-' : '+'}{' '}
      <span
        className={cx(
          'todo-item__text',
          todo && todo.completed && 'todo-item__text--completed'
        )}
      >
        {todo.title}
      </span>
    </li>
  )
}

export default TodoItem
