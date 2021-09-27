import React, { ChangeEvent, useCallback } from "react";
import { FilterValuesType, TaskType } from "./AppWithRedux";
import { AddItemForm } from "./components/AddItemForm/AddItermForm";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from "./state/store";
import { removeTaskAC, changeTitleAC, changeStatusAC, addTaskAC } from "./state/task-reducer";
import { changeTodolistFilterAC, removeTodolistAC, changeTodolistTitleAC } from "./state/todolist-reducer";

type TodolistPropsType = {
  todolistId: string
  title: string
  filter: FilterValuesType
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    todolistId,
    filter
  } = props;

  const dispatch = useDispatch();
  const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.task[todolistId]);

  const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todolistId, 'all')), [dispatch, todolistId]);
  const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todolistId, 'active')), [dispatch, todolistId]);
  const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todolistId, 'completed')), [dispatch, todolistId]);

  const deleteUnnecessaryTodolsit = useCallback(() => {
    dispatch(removeTodolistAC(todolistId));
  }, [dispatch, todolistId]);
  const replaceNewTitleTodolsit = useCallback((newTitle: string) => {
    dispatch(changeTodolistTitleAC(todolistId, newTitle));
  }, [dispatch, todolistId]);

  const getTasksForTodoList = useCallback(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(t => t.isDone === false)
      case 'active':
        return tasks.filter(t => t.isDone === true)
      default:
        return tasks
    }
  }, [filter, tasks]);

  const addNewTask = useCallback((title: string) => {
    dispatch(addTaskAC(title, todolistId));
  }, [dispatch, todolistId]);

  let newTasks = getTasksForTodoList();

  const currentTasks = newTasks.map(t => {
    const onRemoveHandler = () => dispatch(removeTaskAC(t.id, todolistId));
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeStatusAC(t.id, e.currentTarget.checked, todolistId));

    const onChangeTitleHandler = (newValue: string) => dispatch(changeTitleAC(t.id, newValue, todolistId));

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


