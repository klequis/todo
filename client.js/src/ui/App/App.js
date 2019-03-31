import * as React from 'react';
import AddTodo from 'ui/AddTodo'
import TodoList from 'ui/TodoList'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <AddTodo />
        <TodoList />
      </div>
    );
  }
}

export default App;
