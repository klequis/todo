import * as React from "react"
import { connect } from "react-redux"
// import { todosReadRequest } from '../../redux/actions/actions'
import { todosReadRequest } from '../../redux/todo/actions'


import { Todo } from '../../redux/todo/types'
import { AppState } from '../../redux'




import TodoList from './TodoList'
import { getAllTodos } from '../../redux/todo/selectors'
import { green } from '../../logger'

// const TodoContainer = ({ todos }) => (
//   <ul className="todo-list">
//     {todos && todos.length
//       ? todos.map((todo, index) => {
//           return <Todo key={`todo-${todo.id}`} todo={todo} />
//         })
//       : "No todos, yay!"}
//   </ul>
// )


// const todos = [
//   { id: '1', content: 'one', completed: false }
// ]

interface IProps {
  todos: Todo[]
}

class TodoContainer extends React.Component<IProps, []> {
  componentDidMount() {
    green('(0) didMount()')
    todosReadRequest()
    green('(7) didMount - done')
  }

  render() {
    const { todos }  = this.props
    return (
      <div>
        {/* <TodoList todos={this.props.todos} /> */}
        <TodoList todos={todos} />
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  const todos = getAllTodos(state)
  return {
    todos
  }
}

export default connect(mapStateToProps, todosReadRequest)(TodoContainer)

// export default TodoContainer