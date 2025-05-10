import React, { useState } from 'react';
import './App.css';

function App() {
  // カウントアップ用の状態
  const [count, setCount] = useState(0);

  // TODO リスト用の状態
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // カウントアップの処理
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  // TODO リストの処理
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>カウントアップ & TODO アプリ</h1>

        {/* カウントアップセクション */}
        <div className="counter">
          <p>カウント: {count}</p>
          <button onClick={increment}>＋</button>
          <button onClick={decrement}>−</button>
        </div>

        {/* TODO リストセクション */}
        <div className="todo">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <button onClick={addTask}>追加</button>

          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                {task.text}
                <button onClick={() => deleteTask(task.id)}>削除</button>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
