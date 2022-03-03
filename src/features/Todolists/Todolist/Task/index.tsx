import React, {ChangeEvent, useCallback} from "react";

import {TaskStatuses, TaskType} from "../../../../dal/todolists-api";
import {EditableSpan} from "../../../../components/EditableSpan";

import Checkbox from '@mui/material/Checkbox';
import {pink} from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import {useActions} from "../../../../state/hooks/useActions";
import {tasksActions} from "../../../../state/reducers/task-reducer";


type TaskPropsType = {
  task: TaskType
  todolistId: string
};

export const Task: React.FC<TaskPropsType> = React.memo((props) => {
  const {task, todolistId} = props
  const {deletTask, updateTask} = useActions(tasksActions);

  const deletingUnnecessaryTask = useCallback(() => {
    deletTask({todolistId, id: task.id})
  }, [deletTask, task.id, todolistId]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked;
    updateTask({
      todolistId,
      taskId: task.id,
      domainModel: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}
    });
  }, [updateTask, task.id, todolistId]);

  const onChangeTaskTitle = useCallback((title: string) => {
    updateTask({todolistId, taskId: task.id, domainModel: {title}})
  }, [updateTask, task.id, todolistId]);

  return (
    <div
      className={task.status === TaskStatuses.Completed ? 'is-done' : ''}
      style={{position: 'relative'}}
    >
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        onChange={onChangeHandler}
        sx={{
          color: pink[800],
          '&.Mui-checked': {
            color: pink[600],
          },
        }} />
      <EditableSpan title={task.title} onChange={onChangeTaskTitle} />
      <IconButton
        color={'success'}
        size="small"
        onClick={deletingUnnecessaryTask}
        style={{position: 'absolute', top: '5px', right: '0'}}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </div>
  )
})