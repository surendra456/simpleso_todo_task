/* eslint-disable no-undef */

import { Component } from "react";
import "./App.css";
import Cookies from "js-cookie";
import { createRef  , useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { VscSaveAs } from "react-icons/vsc";

class App extends Component {
  state = {
    task: "",
    tasks: [],
    editingTaskId: null,
    editedTask: "",
  };

  
  onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDrop = (e, targetId) => {
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const tasks = this.state.tasks.slice();
    const draggedItem = tasks.find((item) => item.id.toString() === draggedItemId);

    if (draggedItem) {
      const remainingtasks = tasks.filter((item) => item.id.toString() !== draggedItemId);
      const targetIndex = remainingtasks.findIndex((item) => item.id.toString() === targetId);

      remainingtasks.splice(targetIndex, 0, draggedItem);

      this.setState({ tasks: remainingtasks });
    }
  };

  componentDidMount() {
    // Load tasks from cookies on component mount
    const savedTasks = Cookies.get("tasks");
    if (savedTasks) {
      this.setState({ tasks: JSON.parse(savedTasks) });
    }
  }

  componentDidUpdate() {
    // Save tasks to cookies whenever tasks change
    Cookies.set("tasks", JSON.stringify(this.state.tasks));
  }

  onChangetask = (event) => {
    this.setState({ task: event.target.value });
  };

  addTask = () => {
    const { task, tasks } = this.state;
    if (task.trim() !== "") {
      const newTask = { id: tasks.length.toString(), task: task };
      this.setState({
        tasks: [...tasks, newTask],
        task: "",
      });
    }
    
  };

  editTask = (taskId) => {
    const { tasks } = this.state;
    const taskToEdit = tasks.find((task) => task.id === taskId);

    if (taskToEdit) {
      this.setState({
        editingTaskId: taskId,
        editedTask: taskToEdit.task,
      });
    }
  };

  saveEditedTask = () => {
    const { editingTaskId, editedTask, tasks } = this.state;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId ? { ...task, task: editedTask } : task
    );

    this.setState({
      tasks: updatedTasks,
      editingTaskId: null,
      editedTask: "",
    });
  };

  cancelEdit = () => {
    this.setState({
      editingTaskId: null,
      editedTask: "",
    });
  };

  deleteTask = (taskId) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    this.setState({
      tasks: updatedTasks,
      editingTaskId: null,
      editedTask: "",
    });
  };

  
  render() {
    const { task, tasks, editingTaskId, editedTask } = this.state;

    return (
      <div className="App">
        <div className="input-task">
          <input
            type="text"
            placeholder="Enter your task"
            value={task}
            onChange={this.onChangetask}
          />
          <button className="add" onClick={this.addTask}>
            Add
          </button>
        </div>
        <div className="Task-saved">
          { tasks.length == 0 ? <h1 className="Task-h">No Todo List</h1> : <h1 className="Task-h">Todo List</h1> }
          <div>
          <ul className="un-or">
            {tasks.map((task) => (
              <li  className="task-con" 
                key={task.id}
                draggable
                onDragStart={(e) => this.onDragStart(e, task.id)}
                onDragOver={(e) => this.onDragOver(e)}
                onDrop={(e) => this.onDrop(e, task.id.toString())}
                >
                {editingTaskId === task.id ? (
                  <div className="c-button">
                    <input
                      type="text"
                      className="re-in"
                      value={editedTask}
                      onChange={(e) => this.setState({ editedTask: e.target.value })}
                    />
                    <button onClick={() => this.saveEditedTask()}>
                    <VscSaveAs className="c-b" />
                    </button>
                    <button  onClick={() => this.cancelEdit()}>
                    <MdCancel className="c-n"/>
                    </button>
                  </div>
                ) : (
                  <div className="c-button">
                    {task.task}
                    <div>
                      <button  onClick={() => this.editTask(task.id)}>
                      <FaEdit className="c-b"/>
                      </button>
                      <button  onClick={() => this.deleteTask(task.id)}>
                      <MdDeleteForever className="c-n" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;