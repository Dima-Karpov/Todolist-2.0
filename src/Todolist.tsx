import React, { ChangeEvent, useCallback } from "react";
import { FilterValuesType, TaskType } from "./App";
import { AddItemForm } from "./components/AddItemForm/AddItermForm";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";

type TodolistPropsType = {
  todolistId: string
  title: string
  tasks: TaskType[]
  removeTask: (id: string, todolistId: string) => void
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  filter: FilterValuesType
  removeTodolist: (todolistId: string) => void
  changeTodolistTitle: (todolistId: string, newTitle: string) => void
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
    changeTaskTitle,
    changeTodolistTitle,
  } = props;

  const onAllClickHandler = useCallback(() => changeFilter('all', todolistId), [changeFilter, todolistId]);
  const onActiveClickHandler = useCallback(() => changeFilter('active', todolistId), [changeFilter, todolistId]);
  const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolistId), [changeFilter, todolistId]);

  const deleteUnnecessaryTodolsit = useCallback(() => {
    removeTodolist(todolistId);
  }, [removeTodolist, todolistId]);
  const replaceNewTitleTodolsit = useCallback((newTitle: string) => {
    changeTodolistTitle(todolistId, newTitle);
  }, [changeTodolistTitle, todolistId]);


  const currentTasks = tasks.map(t => {
    const onRemoveHandler = () => removeTask(t.id, todolistId);
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(t.id, e.currentTarget.checked, todolistId);

    const onChangeTitleHandler = (newValue: string) => changeTaskTitle(t.id, newValue, todolistId);

    return (
      <li key={t.id} className={t.isDone ? 'is-done' : ''}>
        <input type='checkbox' checked={t.isDone} onChange={onChangeStatusHandler} />

        <EditableSpan title={t.title} onChange={onChangeTitleHandler} />

        <button onClick={onRemoveHandler}>del</button>
      </li>
    )
  });

  const addNewTask = useCallback((title: string) => {
    addTask(title, todolistId);
  }, [addTask, todolistId]);

  return (
    <div>
      <h3> <EditableSpan title={title} onChange={replaceNewTitleTodolsit} /> <button onClick={deleteUnnecessaryTodolsit}>del</button></h3>

      <AddItemForm addItem={addNewTask} />

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


