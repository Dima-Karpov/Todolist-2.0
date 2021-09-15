import React from "react";
import { TasksType } from "./App";

type TodolistPropsType = {
  title: string
  tasks: TasksType[]
  removeTask: (id: number) => void
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    tasks,
    removeTask,
  } = props;



  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>
        {
          tasks.map(t =>
            <li><input type='checkbox' checked={t.isDone} />
              <span>{t.title}</span>
              <button onClick={() => removeTask(t.id)}>del</button>
            </li>
          )
        }
      </ul>
      <div>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </div>
    </div>
  )
});