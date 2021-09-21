import React, { ChangeEvent, useCallback, useMemo } from "react";
import { FilterValuesType, TaskType } from "./App";
import { AddItemForm } from "./components/AddItemForm/AddItermForm";

type TodolistPropsType = {
  todolistId: string
  title: string
  tasks: TaskType[]
  removeTask: (id: string, todolistId: string) => void
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
  filter: FilterValuesType
  removeTodolist: (todolistId: string) => void
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    tasks,
    removeTask,
    changeFilter,
    addTask,
    changeTaskStatus,
    filter,
    todolistId,
    removeTodolist,
  } = props;

  const onAllClickHandler = useCallback(() => changeFilter('all', todolistId), [changeFilter, todolistId]);
  const onActiveClickHandler = useCallback(() => changeFilter('active', todolistId), [changeFilter, todolistId]);
  const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolistId), [changeFilter, todolistId]);

  const deleteUnnecessaryTodolsit = useCallback(() => {
    removeTodolist(todolistId);
  }, [removeTodolist, todolistId]);

  const currentTasks = tasks.map(t => {
    const onRemoveHandler = () => removeTask(t.id, todolistId);
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(t.id, e.currentTarget.checked, todolistId);
    return (
      <li key={t.id} className={t.isDone ? 'is-done' : ''}>
        <input type='checkbox' checked={t.isDone} onChange={onChangeHandler} />
        <span>{t.title}</span>
        <button onClick={onRemoveHandler}>del</button>
      </li>
    )
  }
  );
  const addNewTask = useCallback((title: string) => {
    addTask(title, todolistId)
  },[addTask, title, todolistId])

  return (
    <div>
      <h3>{title} <button onClick={deleteUnnecessaryTodolsit}>del</button></h3>

      <AddItemForm  addItem={addNewTask} />

      <ul>
        {currentTasks}
      </ul>
      <div>
        <button className={filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
        <button className={filter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>
        <button className={filter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
      </div>
    </div>
  )
});

