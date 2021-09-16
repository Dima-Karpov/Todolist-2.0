import React, { ChangeEvent, useCallback, useState, KeyboardEvent, MouseEvent } from "react";
import { FilterValuesType, TasksType } from "./App";

type TodolistPropsType = {
  title: string
  tasks: TasksType[]
  removeTask: (id: string) => void
  changeFilter: (value: FilterValuesType) => void
  addTask: (title: string) => void
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    tasks,
    removeTask,
    changeFilter,
    addTask,
  } = props;

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };
  const addNewTask = useCallback(() => {
    addTask(newTaskTitle);
    setNewTaskTitle('')
  }, [addTask, newTaskTitle]);

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNewTask()
    }
  };

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
        <input value={newTaskTitle} onChange={onChangeNewTaskTitle} onKeyPress={onKeyPressHandler} />
        <button onClick={addNewTask} >+</button>
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