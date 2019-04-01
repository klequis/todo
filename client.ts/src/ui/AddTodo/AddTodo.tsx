import * as React from 'react'
import { connect } from 'react-redux'
import { todoAddRequest } from 'redux/todo/actions'

type TProps = {
  todoAddRequest: (t: { title: string }) => void
}

type TState = {
  inputVal: string
}

class AddTodo extends React.Component<TProps> {

  state: TState = {
    inputVal: ''
  }

  updateInput = (inputVal: string) => {
    this.setState({ inputVal })
  }

  handleAddTodo = () => {
    const { inputVal } = this.state
    if (inputVal.length > 0) {
      const t: { title: string } = {
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
          className='add-todo' onClick={this.handleAddTodo}
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
)(AddTodo)
