import React, { ChangeEvent, useCallback } from "react";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { TaskType } from "./AppWithRedux";

type TaskPropsType = {
  task: TaskType
  todolistId: string

  removeTask: (id: string, todolistId: string) => void
  onChangeTitleHandler: (id: string, newValue: string, todolistId: string) => void
  onChangeStatusHandler: (id: string, isDone: boolean, todolistId: string) => void
}
export const Task: React.FC<TaskPropsType> = React.memo((props) => {
  const { task, todolistId, removeTask, onChangeTitleHandler, onChangeStatusHandler } = props

  const deletingUnnecessaryTask = useCallback(() => {removeTask(task.id, todolistId)}, [removeTask, task.id, todolistId]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {onChangeStatusHandler(task.id, e.currentTarget.checked, todolistId)}, [onChangeStatusHandler, task.id, todolistId])

  const onChangeTaskTitle = useCallback((newValue: string) => {onChangeTitleHandler(task.id, newValue, todolistId)}, [onChangeTitleHandler, task.id, todolistId]);

  return (
    <div className={task.isDone ? 'is-done' : ''}>
      <Checkbox
        checked={task.isDone}
        onChange={onChangeHandler}
        sx={{
          color: pink[800],
          '&.Mui-checked': {
            color: pink[600],
          },
        }} />

      <EditableSpan title={task.title} onChange={onChangeTaskTitle} />

      <IconButton color={'success'} size="small" onClick={deletingUnnecessaryTask}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </div>
  )
})