import React, { useCallback } from "react";
import { AddItemForm } from "./components/AddItemForm/AddItemForm";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { Task } from './Task'

import { addTaskAC, removeTaskAC, changeTitleAC, changeStatusAC } from "./state/task-reducer";
import { changeTodolistFilterAC, removeTodolistAC, changeTodolistTitleAC, FilterValuesType } from "./state/todolist-reducer";
import { TaskStatuses, TaskType } from "./dal/todolists-api";

type TodolistPropsType = {
  todolistId: string
  title: string
  filter: FilterValuesType

  tasks: TaskType[]
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {
    title,
    todolistId,
    filter,
    tasks,
  } = props;

  const dispatch = useDispatch();


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

  const onChangeStatusHandler = useCallback((id: string, status: TaskStatuses, todolistId: string) =>
    dispatch(changeStatusAC(id, {status}, todolistId)), [dispatch]);


  const addNewTask = useCallback((title: string) => {
    dispatch(addTaskAC(title, todolistId));
  }, [dispatch, todolistId]);

  const getTasksForTodoList = useCallback(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(t => t.status === TaskStatuses.New)
      case 'active':
        return tasks.filter(t => t.status === TaskStatuses.Completed)
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


