import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const COUNT_STORAGE_KEY = 'app-counter-count';
const TASKS_STORAGE_KEY = 'react-todo-tasks';

const getInitialState = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return saved;
    }
  }
  return defaultValue;
};

function App() {
  const [count, setCount] = useState(() => getInitialState(COUNT_STORAGE_KEY, 0));
  const [tasks, setTasks] = useState(() => getInitialState(TASKS_STORAGE_KEY, []));
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    localStorage.setItem(COUNT_STORAGE_KEY, count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    if (!isSorted) {
      return tasks;
    }

    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const dateA = a.dueDate;
      const dateB = b.dueDate;

      if (!dateA && dateB) return 1;
      if (dateA && !dateB) return -1;
      if (!dateA && !dateB) return 0;

      return new Date(dateA) - new Date(dateB);
    });
  }, [tasks, isSorted]);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks(prevTasks => [
        ...prevTasks, 
        { 
          id: Date.now(), 
          text: newTaskText, 
          completed: false, 
          dueDate: newTaskDate 
        }
      ]);
      setNewTaskText('');
      setNewTaskDate('');
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const toggleSort = () => {
    setIsSorted(prevIsSorted => !prevIsSorted);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>カウントアップ & TODO アプリ</h1>

        <div className="counter">
          <h2>カウンター</h2>
          <p>カウント: {count}</p>
          <button onClick={increment}>＋</button>
          <button onClick={decrement}>−</button>
        </div>

        <div className="todo">
          <h2>TODO リスト</h2>

          <div className="task-input-controls">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="新しいタスクを入力"
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
            />
            <button onClick={addTask}>追加</button>
          </div>

          <button onClick={toggleSort}>
            並べ替え: {isSorted ? '日付順 (ON)' : '追加順 (OFF)'}
          </button>
          
          <ul>
            {sortedTasks.map(task => (
              <li key={task.id}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.text}
                  </span>
                </div>
                
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="due-date">
                      期限: {task.dueDate}
                    </span>
                  )}
                  <button onClick={() => deleteTask(task.id)}>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
