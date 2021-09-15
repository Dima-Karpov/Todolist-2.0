import React from "react";
import { FilterValuesType, TasksType } from "./App";

type TodolistPropsType = {
  title: string
  tasks: TasksType[]
  removeTask: (id: number) => void
  changeFilter: (value: FilterValuesType) => void
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    tasks,
    removeTask,
    changeFilter,
  } = props;

  const currentTasks = tasks.map(t =>
    <li key={t.id}><input type='checkbox' checked={t.isDone} />
      <span>{t.title}</span>
      <button onClick={() => removeTask(t.id)}>del</button>
    </li>
  );


  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>
        {currentTasks}
      </ul>
      <div>
        <button onClick={() => { changeFilter('all') }}>All</button>
        <button onClick={() => { changeFilter('active') }}>Active</button>
        <button onClick={() => { changeFilter('completed') }}>Completed</button>
      </div>
    </div>
  )
});