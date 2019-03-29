import * as React from "react"
import { connect } from "react-redux"
import { todosReadRequest } from '../../redux/todo/actions'
import Todos from './Todos'
import { getAllTodos } from '../../redux/todo/selectors'
import { green } from '../../logger'

class TodoContainer extends React.Component {
  componentDidMount() {
    todosReadRequest()
  }

  render() {
    const { todos }  = this.props
    return (
      <div>
        <Todos todos={todos} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const todos = getAllTodos(state)
  return {
    todos
  }
}

export default connect(mapStateToProps, todosReadRequest)(TodoContainer)