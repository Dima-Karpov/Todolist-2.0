import React, { useState } from 'react';
import { v1 } from 'uuid';
import './App.css';
import { AddItemForm } from './components/AddItemForm/AddItermForm';
import { Todolist } from './Todolist';

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TaskStateType = {
  [key: string]: TaskType[]
};

export const App: React.FC = React.memo(() => {

  const todolistId1 = v1();
  const todolistId2 = v1();

  const [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolistId1, title: 'Learn Programming', filter: 'all' },
    { id: todolistId2, title: 'Learn English', filter: 'all' },
  ]);

  const [tasks, setTasks] = useState<TaskStateType>({
    [todolistId1]: [
      { id: v1(), title: 'HTML', isDone: true },
      { id: v1(), title: 'CSS', isDone: true },
      { id: v1(), title: 'React', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'HTML', isDone: true },
      { id: v1(), title: 'CSS', isDone: true },
      { id: v1(), title: 'React', isDone: false },
    ]
  });

  const removeTask = (id: string, todolistId: string) => {
    tasks[todolistId] = tasks[todolistId].filter(t => t.id !== id)
    setTasks({ ...tasks });
  };
  const changeFilter = (value: FilterValuesType, todolistId: string) => {
    setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, filter: value } : tl))
  };
  const addTask = (title: string, todolistId: string) => {
    const newTask: TaskType = { id: v1(), title, isDone: false };
    setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] });
  };
  const changeStatus = (taskId: string, isDone: boolean, todolistId: string) => {
    setTasks(
      {
        ...tasks,
        [todolistId]: tasks[todolistId].map(t => t.id === taskId ? { ...t, isDone } : t)
      })
  };

  const removeTodolist = (todolistId: string) => {
    setTodolists(todolists.filter(tl => tl.id !== todolistId));
    delete tasks[todolistId];
    setTasks({ ...tasks })
  };
  const addTodolist = (title: string) => {
    const newTodolist: TodolistType = {
      id: v1(),
      title,
      filter: 'all'
    }
    setTodolists([newTodolist, ...todolists]);
    setTasks({
      ...tasks,
      [newTodolist.id]: []
    });
  };

  return (
    <div className="App">
      <AddItemForm addItem={addTodolist} />
      {todolists.map(tl => {
        let tasksForTodolist = tasks[tl.id];
        if (tl.filter === 'completed') {
          tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
        }
        if (tl.filter === 'active') {
          tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
        }
        return <Todolist
          key={tl.id}
          todolistId={tl.id}
          title={tl.title}
          tasks={tasksForTodolist}
          removeTask={removeTask}
          changeFilter={changeFilter}
          addTask={addTask}
          changeTaskStatus={changeStatus}
          filter={tl.filter}
          removeTodolist={removeTodolist}
        />
      })
      }
    </div>
  );
});


