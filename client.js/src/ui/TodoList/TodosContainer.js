import * as React from "react"
import { connect } from "react-redux"
import { todosReadRequest, todosReadByIdRequest } from '../../redux/todo/actions'
import Todos from './Todos'
import { getAllTodos } from '../../redux/todo/selectors'
// import { green } from '../../logger'

class TodoContainer extends React.Component {
  componentDidMount() {
    this.props.todosReadRequest()
    // this.props.todosReadByIdRequest('5c91aeb8e543802dd5579eef')
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

const actions = {todosReadRequest, todosReadByIdRequest}

const mapStateToProps = (state) => {
  return {
    todos: getAllTodos(state)
  }
}

export default connect(mapStateToProps, actions)(TodoContainer)
// export default TodoContainer