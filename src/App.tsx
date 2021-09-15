import React, { useState } from 'react';
import './App.css';
import { Todolist } from './Todolist';

export type TasksType = {
  id: number
  title: string
  isDone: boolean
};

export const App: React.FC = React.memo(() => {

  const [tasks, setTasks] = useState<TasksType[]>([
    { id: 1, title: 'HTML', isDone: true },
    { id: 2, title: 'CSS', isDone: true },
    { id: 3, title: 'React', isDone: false },
  ]);

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="App">
      <Todolist
        title={'Learn Programming'}
        tasks={tasks}
        removeTask={removeTask}
      />
    </div>
  );
});


