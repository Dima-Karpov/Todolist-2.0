import React, { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";
import { FilterValuesType, TasksType } from "./App";

type TodolistPropsType = {
  title: string
  tasks: TasksType[]
  removeTask: (id: string) => void
  changeFilter: (value: FilterValuesType) => void
  addTask: (title: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    tasks,
    removeTask,
    changeFilter,
    addTask,
    changeTaskStatus,
  } = props;

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };
  const addNewTask = useCallback(() => {
    addTask(newTaskTitle);
    setNewTaskTitle('');
  }, [addTask, newTaskTitle]);
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNewTask();
    }
  };
  const onAllClickHandler = useCallback(() => changeFilter('all'), [changeFilter]);
  const onActiveClickHandler = useCallback(() => changeFilter('active'), [changeFilter]);
  const onCompletedClickHandler = useCallback(() => changeFilter('completed'), [changeFilter]);

  const currentTasks = tasks.map(t => {
    const onRemoveHandler = () => removeTask(t.id);
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(t.id, e.currentTarget.checked);
    return (
      <li key={t.id}>
        <input type='checkbox' checked={t.isDone} onChange={onChangeHandler} />
        <span>{t.title}</span>
        <button onClick={onRemoveHandler}>del</button>
      </li>
    )
  }
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
        <button onClick={onAllClickHandler}>All</button>
        <button onClick={onActiveClickHandler}>Active</button>
        <button onClick={onCompletedClickHandler}>Completed</button>
      </div>
    </div>
  )
});