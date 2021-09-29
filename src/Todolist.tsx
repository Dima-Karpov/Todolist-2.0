import React, { useCallback } from "react";
import { FilterValuesType, TaskType } from "./AppWithRedux";
import { AddItemForm } from "./components/AddItemForm/AddItemForm";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from './Task'

import { AppRootStateType } from "./state/store";
import { addTaskAC, removeTaskAC, changeTitleAC, changeStatusAC } from "./state/task-reducer";
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


  const removeTask = useCallback((id: string, todolistId: string) =>
    dispatch(removeTaskAC(id, todolistId)), [dispatch]);

  const onChangeTitleHandler = useCallback((id: string, newValue: string, todolistId: string) =>
    dispatch(changeTitleAC(id, newValue, todolistId)), [dispatch]);

  const onChangeStatusHandler = useCallback((id: string, isDone: boolean, todolistId: string) =>
    dispatch(changeStatusAC(id, isDone, todolistId)), [dispatch]);


  const addNewTask = useCallback((title: string) => {
    dispatch(addTaskAC(title, todolistId));
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

  let newTasks = getTasksForTodoList();
  const сurrentTasks = newTasks.map(t => <Task
    key={t.id} task={t} todolistId={todolistId}
    onChangeTitleHandler={onChangeTitleHandler}
    removeTask={removeTask}
    onChangeStatusHandler={onChangeStatusHandler} />);


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
        {сurrentTasks}
      </div>

      <div>
        <Button variant={filter === 'all' ? 'outlined' : 'text'} onClick={onAllClickHandler}>All</Button>
        <Button style={{ marginLeft: "5px" }} color={'primary'} variant={filter === 'active' ? 'contained' : 'text'} onClick={onActiveClickHandler}>Active</Button>
        <Button style={{ marginLeft: "5px" }} color={'primary'} variant={filter === 'completed' ? 'contained' : 'text'} onClick={onCompletedClickHandler}>Completed</Button>
      </div>
    </div>
  )
});


