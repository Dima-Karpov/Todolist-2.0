import React, { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";
import { FilterValuesType, TaskType } from "./App";

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

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };

  const addNewTask = useCallback(() => {
    if (newTaskTitle.trim() !== '') {
      addTask(newTaskTitle.trim(), todolistId);
      setNewTaskTitle('');
    } else {
      setError('Title is requared')
    }
  }, [addTask, newTaskTitle, todolistId]);

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === 'Enter') {
      addNewTask();
    }
  };
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



  return (
    <div>
      <h3>{title} <button onClick={deleteUnnecessaryTodolsit}>del</button></h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={onChangeNewTaskTitle}
          onKeyPress={onKeyPressHandler}
          className={error ? 'error' : ''}
        />
        <button onClick={addNewTask} >+</button>

        {error && <div className='error-message'>{error}</div>}

      </div>
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