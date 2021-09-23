import React, { ChangeEvent, useCallback } from "react";
import { FilterValuesType, TaskType } from "./App";
import { AddItemForm } from "./components/AddItemForm/AddItermForm";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';

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
      <div key={t.id} className={t.isDone ? 'is-done' : ''}>
        <Checkbox
          checked={t.isDone}
          onChange={onChangeStatusHandler}
          sx={{
            color: pink[800],
            '&.Mui-checked': {
              color: pink[600],
            },
          }} />

        <EditableSpan title={t.title} onChange={onChangeTitleHandler} />

        <IconButton color={'success'} size="small" onClick={onRemoveHandler}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </div>
    )
  });

  const addNewTask = useCallback((title: string) => {
    addTask(title, todolistId);
  }, [addTask, todolistId]);

  return (
    <div>
      <h3>
        <EditableSpan title={title} onChange={replaceNewTitleTodolsit} />
        <IconButton color={'success'} size="medium" onClick={deleteUnnecessaryTodolsit}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </h3>

      <AddItemForm addItem={addNewTask} />

      <div>
        {currentTasks}
      </div>

      <div>
        <Button variant={filter === 'all' ? 'outlined' : 'text'} onClick={onAllClickHandler}>All</Button>
        <Button style={{ marginLeft: "5px" }} color={'primary'} variant={filter === 'active' ? 'contained' : 'text'} onClick={onActiveClickHandler}>Active</Button>
        <Button style={{ marginLeft: "5px" }} color={'primary'} variant={filter === 'completed' ? 'contained' : 'text'} onClick={onCompletedClickHandler}>Completed</Button>
      </div>
    </div>
  )
});


