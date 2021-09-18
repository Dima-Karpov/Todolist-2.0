import React, { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";
import { FilterValuesType, TasksType } from "./App";

type TodolistPropsType = {
  title: string
  tasks: TasksType[]
  removeTask: (id: string) => void
  changeFilter: (value: FilterValuesType) => void
  addTask: (title: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
  filter: FilterValuesType
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
  } = props;

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };

  const addNewTask = useCallback(() => {
    if (newTaskTitle.trim() !== '') {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    } else {
      setError('Title is requared')
    }
  }, [addTask, newTaskTitle]);

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
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