import * as React from "react"
import { connect } from "react-redux"
import { todoAddRequest } from "../redux/todo/actions"
// import { Todo } from '../redux/todo/types'

export interface Props {
  todoAddRequest: typeof todoAddRequest
}

interface State {
  inputVal: string,
}

class BAddTodo extends React.Component<Props, State> {

  state = {
    inputVal: ''
  }

  updateInput = (inputVal: string) => {
    this.setState({ inputVal })
  }

  handleAddTodo = () => {
    const { inputVal } = this.state
    if (inputVal.length > 0) {
      const t = {
        title: this.state.inputVal
      }
      this.props.todoAddRequest(t)
      this.setState({ inputVal: '' })
    }

  }

  render() {
    return (
      <div>
        <input
          onChange={e => this.updateInput(e.target.value)}
          value={this.state.inputVal}
        />
        <button
          className="add-todo" onClick={this.handleAddTodo}
        >
          Add Todo
        </button>
      </div>
    )
  }
}

export default connect(
  null,
  { todoAddRequest }
)(BAddTodo)
// export default AddTodo
