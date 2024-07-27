import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tasks.css';
import TaskModal from './TaskModal';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false
  });

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, taskData);
      setTasks([...tasks, response.data]);
      setTaskData({ title: '', description: '', dueDate: '', completed: false });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`);
      console.log('Response from server:', response.data);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.response ? error.response.data : error.message);
    }
  };

  const handleToggleCompletion = async (id) => {
    const task = tasks.find(task => task._id === id);
    const updatedTask = { ...task, completed: !task.completed };

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSaveTask = (updatedTask) => {
    setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
    setSelectedTask(null);
  };

  return (
    <div className="tasks-container">
      <h3>Tasks</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Task</button>
      </form>
      <div className="tasks-container">
      <h3>Tasks</h3>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="task-item" onClick={() => setSelectedTask(task)}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleCompletion(task._id)}
              onClick={(e) => e.stopPropagation()}
            />
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }} className="delete-button">Delete</button>
          </div>
        ))}
      </div>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
    </div>
  );
}

export default Tasks;
