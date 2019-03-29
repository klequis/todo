import React from 'react'
import cx from 'classnames'

const Todo = ({ todo /*, toggleTodo*/ }) => {
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

export default Todo
