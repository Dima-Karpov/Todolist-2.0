import React, { useState } from 'react';
import './App.css';
import { Todolist } from './Todolist';

export type TasksType = {
  id: number
  title: string
  isDone: boolean
};

export type FilterValuesType = 'all' | 'completed' | 'active';

export const App: React.FC = React.memo(() => {

  const [tasks, setTasks] = useState<TasksType[]>([
    { id: 1, title: 'HTML', isDone: true },
    { id: 2, title: 'CSS', isDone: true },
    { id: 3, title: 'React', isDone: false },
  ]);
  const [filter, setFilter] = useState<FilterValuesType>('all')

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };
  const changeFilter = (value: FilterValuesType) => {
    setFilter(value);
  };

  let tasksForTodolist = tasks;
  if (filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.isDone === true);
  }
  if (filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.isDone === false);
  }

  return (
    <div className="App">
      <Todolist
        title={'Learn Programming'}
        tasks={tasksForTodolist}
        removeTask={removeTask}
        changeFilter={changeFilter}
      />
    </div>
  );
});


