import React from "react"
import { connect } from "react-redux"
import { getTodosByVisibilityFilter } from "../../redux/selectors/selectors"
import { getTodos } from '../../redux/actions/actions'
import TodoList from './TodoList'

// const TodoContainer = ({ todos }) => (
//   <ul className="todo-list">
//     {todos && todos.length
//       ? todos.map((todo, index) => {
//           return <Todo key={`todo-${todo.id}`} todo={todo} />
//         })
//       : "No todos, yay!"}
//   </ul>
// )

class TodoContainer extends React.Component {
  componentDidMount() {
    console.log('did mount');

    getTodos()
  }

  render() {

    return (
      <TodoList todos={this.props.todos} />
    )
  }
}

const mapStateToProps = state => {
  const { visibilityFilter } = state
  const todos = getTodosByVisibilityFilter(state, visibilityFilter)
  return {
    todos
  }
}

export default connect(mapStateToProps, getTodos)(TodoContainer)
