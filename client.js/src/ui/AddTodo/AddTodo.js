import * as React from 'react'
import { connect } from 'react-redux'
import { todoAddRequest } from 'redux/todo/actions'


class AddTodo extends React.Component {

  state = {
    inputVal: ''
  }

  updateInput = (inputVal) => {
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
