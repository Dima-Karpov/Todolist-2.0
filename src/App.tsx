import React, { useState } from 'react';
import { v1 } from 'uuid';
import './App.css';
import { Todolist } from './Todolist';

export type TasksType = {
  id: string
  title: string
  isDone: boolean
};

export type FilterValuesType = 'all' | 'completed' | 'active';

export const App: React.FC = React.memo(() => {

  const [tasks, setTasks] = useState<TasksType[]>([
    { id: v1(), title: 'HTML', isDone: true },
    { id: v1(), title: 'CSS', isDone: true },
    { id: v1(), title: 'React', isDone: false },
  ]);
  const [filter, setFilter] = useState<FilterValuesType>('all')

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };
  const changeFilter = (value: FilterValuesType) => {
    setFilter(value);
  };
  const addTask = (title: string) => {
    const newTask: TasksType = { id: v1(), title, isDone: false };
    const newTasks = [newTask, ...tasks];
    setTasks(newTasks);
  };
  const changeStatus = (taskId: string, isDone: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isDone } : t))
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
        addTask={addTask}
        changeTaskStatus={changeStatus}
        filter={filter}
      />
    </div>
  );
});


