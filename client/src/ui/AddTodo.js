import React from "react"
import { connect } from "react-redux"
import { addTodo } from "../redux/actions/actions"

class AddTodo extends React.Component {

  state = {
    inputVal: ''
  }

  updateInput = inputVal => {
    this.setState({ inputVal })
  }

  handleAddTodo = () => {
    const { inputVal } = this.state
    if (inputVal.length > 0) {
      this.props.addTodo(this.state.inputVal)
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
  { addTodo }
)(AddTodo)
// export default AddTodo
