import React, { ChangeEvent, useCallback } from "react";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';

import { changeStatusAC, changeTitleAC, removeTaskAC } from "./state/task-reducer";
import { TaskType } from "./AppWithRedux";

type TaskPropsType = {
  task: TaskType
  todolistId: string
}
export const Task: React.FC<TaskPropsType> = React.memo((props) => {
  const { task, todolistId } = props

  const dispatch = useDispatch();

  const onRemoveHandler = useCallback(() =>
    dispatch(removeTaskAC(task.id, todolistId)), [dispatch, todolistId, task.id]);
    
  const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) =>
    dispatch(changeStatusAC(task.id, e.currentTarget.checked, todolistId)), [dispatch, todolistId, task.id]);

  const onChangeTitleHandler = useCallback((newValue: string) =>
    dispatch(changeTitleAC(task.id, newValue, todolistId)), [dispatch, todolistId, task.id]);

  return (
    <div className={task.isDone ? 'is-done' : ''}>
      <Checkbox
        checked={task.isDone}
        onChange={onChangeStatusHandler}
        sx={{
          color: pink[800],
          '&.Mui-checked': {
            color: pink[600],
          },
        }} />

      <EditableSpan title={task.title} onChange={onChangeTitleHandler} />

      <IconButton color={'success'} size="small" onClick={onRemoveHandler}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </div>
  )
})