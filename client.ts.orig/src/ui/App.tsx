import * as React from 'react';
import './App.css';
import AddTodo from './AddTodo'
import TodoList from './TodoList'

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <AddTodo />
        <TodoList />
      </div>
    );
  }
}

export default App;
