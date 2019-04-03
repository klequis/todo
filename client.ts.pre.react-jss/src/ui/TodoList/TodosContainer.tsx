import * as React from "react"
import { connect } from "react-redux"
import { todosReadRequest, todosReadByIdRequest } from '../../redux/todo/actions'
import Todos from './Todos'
import { getAllTodos } from '../../redux/todo/selectors'
import { TODOS_READ_REQUEST_KEY } from 'redux/todo/constants'
import { getRequest } from 'redux/requests/selectors';
import { AppState } from 'global-types'
// import { green } from '../../logger'

interface IProps {
  todos: []
  todosReadRequest: () => void
}

class TodoContainer extends React.Component<IProps, []> {
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

const mapStateToProps = (state: AppState) => {
  return {
    todos: getAllTodos(state),
    todosReadRequestStatus: getRequest(state, TODOS_READ_REQUEST_KEY)
  }
}

export default connect(mapStateToProps, actions)(TodoContainer)
// export default TodoContainer