import React from "react";
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: ''
    };
  };

  componentDidMount() {
    this.socket = io('localhost:8000');

    this.socket.on('updateData', (tasks) => this.updateData(tasks));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
  };

  removeTask(id, isLocal = false) {
    const { tasks } = this.state;
    const filteredTasks = tasks.filter((task) => task.id !== id);
    this.setState({ tasks: filteredTasks });
    if(isLocal) {
      this.socket.emit('removeTask', id);
    };
  };

  submitForm(e) {
    e.preventDefault();
    const task = {id: uuidv4(), name: this.state.taskName}
    this.addTask(task);
    this.socket.emit('addTask', task);
    this.setState({ taskName: '' });
  };

  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, task] })
  };

  updateData(tasks) {
    this.setState({ tasks });
  };

  render() {
    const { tasks, taskName } = this.state;

    return (
      <div className='App'>      
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map(task => (
              <li className='task' key={task.id}>
                {task.name}
                <button className='btn btn--red' onClick={() => this.removeTask(task.id, true)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id='add-task-form' onSubmit={(e) => this.submitForm(e)}>
            <input className='text-input' autoComplete='off' type='text' placeholder='Type your description' id='task-name' 
            value={taskName} onChange={(e) => this.setState({ taskName: e.target.value })} />
            <button className='btn' type='submit'>Add</button>
          </form>

        </section>      
      </div>
    )
  };
};

export default App;